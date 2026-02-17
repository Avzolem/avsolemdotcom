import { YugiohDeck, CardInDeck, DECK_LIMITS } from '@/types/yugioh';

interface ExportOptions {
  playerName: string;
  konamiId?: string;
  eventName?: string;
  eventDate?: string;
}

// Convert image URL to base64 data URL
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

// Categorize main deck cards into Monster/Spell/Trap
function categorizeCards(cards: CardInDeck[]) {
  const monsters: CardInDeck[] = [];
  const spells: CardInDeck[] = [];
  const traps: CardInDeck[] = [];

  cards.forEach((card) => {
    if (card.cardType.toLowerCase().includes('spell')) {
      spells.push(card);
    } else if (card.cardType.toLowerCase().includes('trap')) {
      traps.push(card);
    } else {
      monsters.push(card);
    }
  });

  // Sort alphabetically within each category
  const sort = (a: CardInDeck, b: CardInDeck) => a.cardName.localeCompare(b.cardName);
  monsters.sort(sort);
  spells.sort(sort);
  traps.sort(sort);

  return { monsters, spells, traps };
}

function getCardCount(cards: CardInDeck[]): number {
  return cards.reduce((sum, c) => sum + c.quantity, 0);
}

export async function exportDeckToPdf(deck: YugiohDeck, options: ExportOptions): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF('p', 'mm', 'letter'); // 215.9 x 279.4 mm

  const pageW = 215.9;
  const margin = 12;
  const contentW = pageW - margin * 2;
  let y = margin;

  // Colors
  const goldRGB: [number, number, number] = [180, 150, 50];
  const darkBg: [number, number, number] = [20, 20, 25];
  const cardBg: [number, number, number] = [30, 30, 35];
  const white: [number, number, number] = [255, 255, 255];
  const lightGray: [number, number, number] = [180, 180, 180];
  const greenRGB: [number, number, number] = [34, 197, 94];
  const redRGB: [number, number, number] = [239, 68, 68];

  // Background
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageW, 279.4, 'F');

  // === HEADER ===
  // Gold top border
  doc.setFillColor(...goldRGB);
  doc.rect(0, 0, pageW, 2, 'F');

  // Load logos
  const logoPromises = [
    imageToBase64('/images/yugioh-logo-icon.png').catch(() => null),
    imageToBase64('/images/konami-logo.webp').catch(() => null),
  ];
  const [ygoLogo, konamiLogo] = await Promise.all(logoPromises);

  // Yu-Gi-Oh logo (left)
  if (ygoLogo) {
    try {
      doc.addImage(ygoLogo, 'PNG', margin, y + 3, 14, 14);
    } catch { /* fallback: no logo */ }
  }

  // Title
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...goldRGB);
  doc.text('OFFICIAL DECK LIST', margin + 18, y + 5);

  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  doc.text('KDE Tournament Format', margin + 18, y + 11);

  // Konami logo (right)
  if (konamiLogo) {
    try {
      doc.addImage(konamiLogo, 'WEBP', pageW - margin - 36, y - 1, 36, 8);
    } catch {
      // Fallback: text
      doc.setFontSize(8);
      doc.setTextColor(...goldRGB);
      doc.text('KONAMI', pageW - margin, y + 2, { align: 'right' });
    }
  } else {
    doc.setFontSize(8);
    doc.setTextColor(...goldRGB);
    doc.text('KONAMI', pageW - margin, y + 2, { align: 'right' });
  }
  doc.setFontSize(6);
  doc.setTextColor(...lightGray);
  doc.text('Digital Entertainment', pageW - margin, y + 10, { align: 'right' });

  y += 20;

  // Gold separator
  doc.setFillColor(...goldRGB);
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
  doc.text('KONAMI ID (COSSY)', col2, y + 5);

  doc.setFontSize(11);
  doc.setTextColor(...white);
  doc.setFont('helvetica', 'bold');
  doc.text(options.playerName || '________________________', col1, y + 11);
  doc.text(options.konamiId || '________________________', col2, y + 11);

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
  doc.setFillColor(goldRGB[0], goldRGB[1], goldRGB[2]);
  doc.roundedRect(margin, y, contentW, 8, 1.5, 1.5, 'F');
  doc.setFontSize(11);
  doc.setTextColor(...darkBg);
  doc.setFont('helvetica', 'bold');
  doc.text(`DECK: ${deck.name.toUpperCase()}`, margin + 4, y + 5.5);
  y += 12;

  // Categorize cards
  const mainCards = deck.cards.filter((c) => c.zone === 'main');
  const extraCards = deck.cards.filter((c) => c.zone === 'extra').sort((a, b) => a.cardName.localeCompare(b.cardName));
  const sideCards = deck.cards.filter((c) => c.zone === 'side').sort((a, b) => a.cardName.localeCompare(b.cardName));
  const { monsters, spells, traps } = categorizeCards(mainCards);

  const mainTotal = getCardCount(mainCards);
  const extraTotal = getCardCount(extraCards);
  const sideTotal = getCardCount(sideCards);
  const mainValid = mainTotal >= DECK_LIMITS.MAIN_MIN && mainTotal <= DECK_LIMITS.MAIN_MAX;

  // Two-column layout: Main Deck (left), Extra + Side (right)
  const colW = (contentW - 4) / 2;
  const leftX = margin;
  const rightX = margin + colW + 4;

  // Helper: Draw a section header
  function drawSectionHeader(x: number, yPos: number, title: string, count: number, max: string, valid: boolean): number {
    doc.setFillColor(...cardBg);
    doc.roundedRect(x, yPos, colW, 7, 1, 1, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...goldRGB);
    doc.text(title, x + 3, yPos + 4.8);

    const countColor: [number, number, number] = valid ? greenRGB : redRGB;
    doc.setTextColor(...countColor);
    doc.text(`${count}/${max}`, x + colW - 3, yPos + 4.8, { align: 'right' });

    return yPos + 9;
  }

  // Helper: Draw card lines
  function drawCardLines(x: number, yPos: number, cards: CardInDeck[]): number {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');

    cards.forEach((card) => {
      // Quantity badge
      doc.setFillColor(50, 50, 55);
      doc.roundedRect(x + 1, yPos - 2.8, 6, 3.6, 0.8, 0.8, 'F');
      doc.setTextColor(...goldRGB);
      doc.setFont('helvetica', 'bold');
      doc.text(`${card.quantity}x`, x + 4, yPos, { align: 'center' });

      // Card name
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

  // Helper: Draw subtotal line
  function drawSubtotal(x: number, yPos: number, label: string, count: number): number {
    doc.setDrawColor(50, 50, 55);
    doc.setLineWidth(0.3);
    doc.line(x + 3, yPos, x + colW - 3, yPos);
    yPos += 3.5;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...lightGray);
    doc.text(label, x + 3, yPos);
    doc.setTextColor(...goldRGB);
    doc.text(`${count}`, x + colW - 3, yPos, { align: 'right' });

    return yPos + 4;
  }

  // === LEFT COLUMN: MAIN DECK ===
  let leftY = y;

  leftY = drawSectionHeader(leftX, leftY, 'MAIN DECK - MONSTERS', getCardCount(monsters), `${mainTotal}/${DECK_LIMITS.MAIN_MIN}-${DECK_LIMITS.MAIN_MAX}`, mainValid);
  leftY = drawCardLines(leftX, leftY, monsters);
  leftY = drawSubtotal(leftX, leftY, 'Monsters', getCardCount(monsters));

  // Spells
  leftY += 1;
  doc.setFillColor(...cardBg);
  doc.roundedRect(leftX, leftY, colW, 5.5, 1, 1, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...goldRGB);
  doc.text('SPELL CARDS', leftX + 3, leftY + 3.8);
  doc.text(`${getCardCount(spells)}`, leftX + colW - 3, leftY + 3.8, { align: 'right' });
  leftY += 7;
  leftY = drawCardLines(leftX, leftY, spells);
  leftY = drawSubtotal(leftX, leftY, 'Spells', getCardCount(spells));

  // Traps
  leftY += 1;
  doc.setFillColor(...cardBg);
  doc.roundedRect(leftX, leftY, colW, 5.5, 1, 1, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...goldRGB);
  doc.text('TRAP CARDS', leftX + 3, leftY + 3.8);
  doc.text(`${getCardCount(traps)}`, leftX + colW - 3, leftY + 3.8, { align: 'right' });
  leftY += 7;
  leftY = drawCardLines(leftX, leftY, traps);
  leftY = drawSubtotal(leftX, leftY, 'Traps', getCardCount(traps));

  // Main Deck Total
  leftY += 2;
  doc.setFillColor(goldRGB[0], goldRGB[1], goldRGB[2]);
  doc.roundedRect(leftX, leftY, colW, 7, 1, 1, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkBg);
  doc.text('MAIN DECK TOTAL', leftX + 3, leftY + 5);
  doc.text(`${mainTotal}`, leftX + colW - 3, leftY + 5, { align: 'right' });

  // === RIGHT COLUMN: EXTRA + SIDE ===
  let rightY = y;

  rightY = drawSectionHeader(rightX, rightY, 'EXTRA DECK', extraTotal, `${DECK_LIMITS.EXTRA_MAX}`, extraTotal <= DECK_LIMITS.EXTRA_MAX);
  rightY = drawCardLines(rightX, rightY, extraCards);
  rightY = drawSubtotal(rightX, rightY, 'Extra Deck Total', extraTotal);

  // Side Deck
  rightY += 4;
  rightY = drawSectionHeader(rightX, rightY, 'SIDE DECK', sideTotal, `${DECK_LIMITS.SIDE_MAX}`, sideTotal <= DECK_LIMITS.SIDE_MAX);
  rightY = drawCardLines(rightX, rightY, sideCards);
  rightY = drawSubtotal(rightX, rightY, 'Side Deck Total', sideTotal);

  // === JUDGE USE SECTION ===
  rightY += 6;
  doc.setFillColor(...cardBg);
  doc.roundedRect(rightX, rightY, colW, 30, 2, 2, 'F');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...goldRGB);
  doc.text('FOR JUDGE USE ONLY', rightX + 3, rightY + 5);

  doc.setDrawColor(50, 50, 55);
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

  doc.setFillColor(...goldRGB);
  doc.rect(0, footerY, pageW, 0.3, 'F');

  doc.setFontSize(6);
  doc.setTextColor(...lightGray);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Yu-Gi-Oh! is a registered trademark of Konami Digital Entertainment. This deck list was generated by Yu-Gi-Oh! Manager (avsolem.com/yugioh).',
    pageW / 2,
    footerY + 4,
    { align: 'center' }
  );

  doc.setTextColor(...goldRGB);
  doc.setFont('helvetica', 'bold');
  doc.text(
    'KONAMI DIGITAL ENTERTAINMENT',
    pageW / 2,
    footerY + 7,
    { align: 'center' }
  );

  // Save
  const safeName = deck.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  doc.save(`deck_list_${safeName}.pdf`);
}
