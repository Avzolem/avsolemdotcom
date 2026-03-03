import { PokemonDeck, CardInDeck, DECK_LIMITS } from '@/types/pokemon';

interface ExportOptions {
  playerName: string;
  playPokemonId?: string;
  eventName?: string;
  eventDate?: string;
}

async function imageToBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function categorizeCards(cards: CardInDeck[]) {
  const pokemon: CardInDeck[] = [];
  const trainers: CardInDeck[] = [];
  const energy: CardInDeck[] = [];

  cards.forEach((card) => {
    switch (card.zone) {
      case 'pokemon':
        pokemon.push(card);
        break;
      case 'trainer':
        trainers.push(card);
        break;
      case 'energy':
        energy.push(card);
        break;
      default:
        pokemon.push(card);
    }
  });

  const sort = (a: CardInDeck, b: CardInDeck) => a.cardName.localeCompare(b.cardName);
  pokemon.sort(sort);
  trainers.sort(sort);
  energy.sort(sort);

  return { pokemon, trainers, energy };
}

function getCardCount(cards: CardInDeck[]): number {
  return cards.reduce((sum, c) => sum + c.quantity, 0);
}

export async function exportDeckToPdf(deck: PokemonDeck, options: ExportOptions): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF('p', 'mm', 'letter');

  const pageW = 215.9;
  const margin = 12;
  const contentW = pageW - margin * 2;
  let y = margin;

  // Pokemon colors
  const redRGB: [number, number, number] = [204, 0, 0];
  const blueRGB: [number, number, number] = [59, 130, 246];
  const yellowRGB: [number, number, number] = [255, 203, 5];
  const darkBg: [number, number, number] = [20, 20, 30];
  const cardBg: [number, number, number] = [30, 30, 40];
  const white: [number, number, number] = [255, 255, 255];
  const lightGray: [number, number, number] = [180, 180, 180];
  const greenRGB: [number, number, number] = [34, 197, 94];
  const errorRed: [number, number, number] = [239, 68, 68];

  // Background
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageW, 279.4, 'F');

  // Red top border
  doc.setFillColor(...redRGB);
  doc.rect(0, 0, pageW, 2, 'F');

  // Load logo
  const logoPromise = imageToBase64('/images/pokemon/pokemon-logo.png').catch(() => null);
  const pokemonLogo = await logoPromise;

  // Pokemon logo (left)
  if (pokemonLogo) {
    try {
      doc.addImage(pokemonLogo, 'PNG', margin, y + 3, 30, 12);
    } catch { /* fallback: no logo */ }
  }

  // Title
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...yellowRGB);
  doc.text('OFFICIAL DECK LIST', margin + 34, y + 5);

  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  doc.text('Play! Pokemon Tournament Format', margin + 34, y + 11);

  // TPCi text (right)
  doc.setFontSize(8);
  doc.setTextColor(...blueRGB);
  doc.text('The Pokemon Company', pageW - margin, y + 2, { align: 'right' });
  doc.setFontSize(6);
  doc.setTextColor(...lightGray);
  doc.text('International', pageW - margin, y + 6, { align: 'right' });

  y += 20;

  // Separator
  doc.setFillColor(...redRGB);
  doc.rect(margin, y, contentW, 0.5, 'F');
  y += 4;

  // === PLAYER INFO ===
  const infoBoxH = 22;
  doc.setFillColor(...cardBg);
  doc.roundedRect(margin, y, contentW, infoBoxH, 2, 2, 'F');

  const col1 = margin + 4;
  const col2 = margin + contentW / 2 + 4;

  doc.setFontSize(7);
  doc.setTextColor(...lightGray);
  doc.text('PLAYER NAME', col1, y + 5);
  doc.text('PLAY! POKEMON ID', col2, y + 5);

  doc.setFontSize(11);
  doc.setTextColor(...white);
  doc.setFont('helvetica', 'bold');
  doc.text(options.playerName || '________________________', col1, y + 11);
  doc.text(options.playPokemonId || '________________________', col2, y + 11);

  doc.setFontSize(7);
  doc.setTextColor(...lightGray);
  doc.setFont('helvetica', 'normal');
  doc.text('EVENT', col1, y + 16);
  doc.text('DATE', col2, y + 16);

  doc.setFontSize(10);
  doc.setTextColor(...white);
  doc.setFont('helvetica', 'bold');
  doc.text(options.eventName || '________________________', col1, y + 21);
  doc.text(options.eventDate || new Date().toLocaleDateString(), col2, y + 21);

  y += infoBoxH + 4;

  // === DECK NAME ===
  doc.setFillColor(...redRGB);
  doc.roundedRect(margin, y, contentW, 8, 1.5, 1.5, 'F');
  doc.setFontSize(11);
  doc.setTextColor(...white);
  doc.setFont('helvetica', 'bold');
  doc.text(`DECK: ${deck.name.toUpperCase()}`, margin + 4, y + 5.5);
  y += 12;

  // Categorize cards
  const { pokemon, trainers, energy } = categorizeCards(deck.cards);
  const totalCards = getCardCount(deck.cards);
  const deckValid = totalCards === DECK_LIMITS.DECK_SIZE;

  // Two-column layout
  const colW = (contentW - 4) / 2;
  const leftX = margin;
  const rightX = margin + colW + 4;

  function drawSectionHeader(x: number, yPos: number, title: string, count: number, max: string, valid: boolean): number {
    doc.setFillColor(...cardBg);
    doc.roundedRect(x, yPos, colW, 7, 1, 1, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...yellowRGB);
    doc.text(title, x + 3, yPos + 4.8);

    const countColor: [number, number, number] = valid ? greenRGB : errorRed;
    doc.setTextColor(...countColor);
    doc.text(`${count}/${max}`, x + colW - 3, yPos + 4.8, { align: 'right' });

    return yPos + 9;
  }

  function drawCardLines(x: number, yPos: number, cards: CardInDeck[]): number {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');

    cards.forEach((card) => {
      doc.setFillColor(50, 50, 60);
      doc.roundedRect(x + 1, yPos - 2.8, 6, 3.6, 0.8, 0.8, 'F');
      doc.setTextColor(...yellowRGB);
      doc.setFont('helvetica', 'bold');
      doc.text(`${card.quantity}x`, x + 4, yPos, { align: 'center' });

      doc.setTextColor(...white);
      doc.setFont('helvetica', 'normal');
      const maxNameW = colW - 12;
      const truncated = doc.getTextWidth(card.cardName) > maxNameW
        ? card.cardName.substring(0, 35) + '...'
        : card.cardName;
      doc.text(truncated, x + 9, yPos);

      yPos += 4.2;
    });

    return yPos;
  }

  function drawSubtotal(x: number, yPos: number, label: string, count: number): number {
    doc.setDrawColor(50, 50, 60);
    doc.setLineWidth(0.3);
    doc.line(x + 3, yPos, x + colW - 3, yPos);
    yPos += 3.5;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...lightGray);
    doc.text(label, x + 3, yPos);
    doc.setTextColor(...yellowRGB);
    doc.text(`${count}`, x + colW - 3, yPos, { align: 'right' });

    return yPos + 4;
  }

  // === LEFT COLUMN: POKEMON + TRAINER ===
  let leftY = y;

  leftY = drawSectionHeader(leftX, leftY, 'POKEMON', getCardCount(pokemon), `${totalCards}/${DECK_LIMITS.DECK_SIZE}`, deckValid);
  leftY = drawCardLines(leftX, leftY, pokemon);
  leftY = drawSubtotal(leftX, leftY, 'Pokemon', getCardCount(pokemon));

  // Trainers
  leftY += 1;
  doc.setFillColor(...cardBg);
  doc.roundedRect(leftX, leftY, colW, 5.5, 1, 1, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...yellowRGB);
  doc.text('TRAINER CARDS', leftX + 3, leftY + 3.8);
  doc.text(`${getCardCount(trainers)}`, leftX + colW - 3, leftY + 3.8, { align: 'right' });
  leftY += 7;
  leftY = drawCardLines(leftX, leftY, trainers);
  leftY = drawSubtotal(leftX, leftY, 'Trainers', getCardCount(trainers));

  // Deck Total
  leftY += 2;
  doc.setFillColor(...redRGB);
  doc.roundedRect(leftX, leftY, colW, 7, 1, 1, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...white);
  doc.text('DECK TOTAL', leftX + 3, leftY + 5);
  doc.text(`${totalCards}/${DECK_LIMITS.DECK_SIZE}`, leftX + colW - 3, leftY + 5, { align: 'right' });

  // === RIGHT COLUMN: ENERGY + JUDGE ===
  let rightY = y;

  rightY = drawSectionHeader(rightX, rightY, 'ENERGY', getCardCount(energy), `${getCardCount(energy)}`, true);
  rightY = drawCardLines(rightX, rightY, energy);
  rightY = drawSubtotal(rightX, rightY, 'Energy Total', getCardCount(energy));

  // Judge section
  rightY += 6;
  doc.setFillColor(...cardBg);
  doc.roundedRect(rightX, rightY, colW, 30, 2, 2, 'F');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...blueRGB);
  doc.text('FOR JUDGE USE ONLY', rightX + 3, rightY + 5);

  doc.setDrawColor(50, 50, 60);
  doc.setLineWidth(0.2);
  doc.line(rightX + 3, rightY + 7, rightX + colW - 3, rightY + 7);

  const judgeFields = [
    'Deck List Checked? ____',
    'Judge Initial: ____________',
    'Deck Check Rd: ____',
    'Infractions: ____________',
    'Notes: ________________',
  ];

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightGray);
  judgeFields.forEach((field, i) => {
    doc.text(field, rightX + 3, rightY + 12 + i * 4.5);
  });

  // === FOOTER ===
  const footerY = 272;

  doc.setFillColor(...redRGB);
  doc.rect(0, footerY, pageW, 0.3, 'F');

  doc.setFontSize(6);
  doc.setTextColor(...lightGray);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Pokemon is a registered trademark of Nintendo, Creatures, Inc., and GAME FREAK, inc. This deck list was generated by Pokemon TCG Manager (avsolem.com/pokemon).',
    pageW / 2,
    footerY + 4,
    { align: 'center' }
  );

  doc.setTextColor(...blueRGB);
  doc.setFont('helvetica', 'bold');
  doc.text(
    'THE POKEMON COMPANY INTERNATIONAL',
    pageW / 2,
    footerY + 7,
    { align: 'center' }
  );

  const safeName = deck.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  doc.save(`deck_list_${safeName}.pdf`);
}
