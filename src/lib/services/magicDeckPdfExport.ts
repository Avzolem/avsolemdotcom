import jsPDF from 'jspdf';
import { MagicDeck, CardInDeck, getPrimaryType, DECK_LIMITS } from '@/types/magic';

interface DeckExportOptions {
  playerName?: string;
  dciNumber?: string;
  eventName?: string;
  eventDate?: string;
  format?: string;
}

function groupCardsByType(cards: CardInDeck[]): Record<string, CardInDeck[]> {
  const groups: Record<string, CardInDeck[]> = {
    Creatures: [],
    Instants: [],
    Sorceries: [],
    Enchantments: [],
    Artifacts: [],
    Planeswalkers: [],
    Lands: [],
    Other: [],
  };

  for (const card of cards) {
    const type = getPrimaryType(card.cardType);
    switch (type) {
      case 'Creature':
        groups.Creatures.push(card);
        break;
      case 'Instant':
        groups.Instants.push(card);
        break;
      case 'Sorcery':
        groups.Sorceries.push(card);
        break;
      case 'Enchantment':
        groups.Enchantments.push(card);
        break;
      case 'Artifact':
        groups.Artifacts.push(card);
        break;
      case 'Planeswalker':
        groups.Planeswalkers.push(card);
        break;
      case 'Land':
        groups.Lands.push(card);
        break;
      default:
        groups.Other.push(card);
    }
  }

  // Remove empty groups
  return Object.fromEntries(
    Object.entries(groups).filter(([, cards]) => cards.length > 0)
  );
}

export function exportDeckToPdf(deck: MagicDeck, options: DeckExportOptions = {}): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = margin;

  // Colors
  const red = [46, 10, 10] as [number, number, number];
  const gold = [212, 175, 55] as [number, number, number];
  const white = [255, 255, 255] as [number, number, number];
  const lightGray = [200, 200, 200] as [number, number, number];

  // Header background
  doc.setFillColor(...red);
  doc.rect(0, 0, pageWidth, 35, 'F');

  // Gold accent line
  doc.setFillColor(...gold);
  doc.rect(0, 35, pageWidth, 2, 'F');

  // Title
  doc.setTextColor(...white);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('MAGIC: THE GATHERING', pageWidth / 2, 14, { align: 'center' });
  doc.setFontSize(12);
  doc.text('DECK REGISTRATION SHEET', pageWidth / 2, 22, { align: 'center' });

  // Deck name
  doc.setFontSize(10);
  doc.setTextColor(...gold);
  doc.text(deck.name.toUpperCase(), pageWidth / 2, 30, { align: 'center' });

  y = 42;

  // Player info section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  const infoY = y;
  const col1 = margin;
  const col2 = pageWidth / 2 + 5;

  // Left column
  doc.setFont('helvetica', 'bold');
  doc.text('Player:', col1, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(options.playerName || '____________________', col1 + 18, infoY);

  doc.setFont('helvetica', 'bold');
  doc.text('DCI #:', col1, infoY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(options.dciNumber || '____________________', col1 + 18, infoY + 6);

  // Right column
  doc.setFont('helvetica', 'bold');
  doc.text('Event:', col2, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(options.eventName || '____________________', col2 + 18, infoY);

  doc.setFont('helvetica', 'bold');
  doc.text('Date:', col2, infoY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(options.eventDate || new Date().toLocaleDateString(), col2 + 18, infoY + 6);

  // Format
  doc.setFont('helvetica', 'bold');
  doc.text('Format:', col1, infoY + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(options.format || deck.format || 'Standard', col1 + 18, infoY + 12);

  y = infoY + 20;

  // Separator
  doc.setDrawColor(...lightGray);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // Main Deck
  const mainCards = deck.cards.filter((c) => c.zone === 'main');
  const sideCards = deck.cards.filter((c) => c.zone === 'sideboard');
  const mainTotal = mainCards.reduce((sum, c) => sum + c.quantity, 0);
  const sideTotal = sideCards.reduce((sum, c) => sum + c.quantity, 0);

  // Main deck header
  doc.setFillColor(...red);
  doc.rect(margin, y - 3, pageWidth - margin * 2, 7, 'F');
  doc.setTextColor(...white);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`MAIN DECK (${mainTotal} cards)`, margin + 3, y + 1.5);

  // Validation color
  const isMainValid = mainTotal >= DECK_LIMITS.MAIN_MIN;
  if (isMainValid) {
    doc.setFillColor(0, 128, 0);
  } else {
    doc.setFillColor(200, 0, 0);
  }
  doc.circle(pageWidth - margin - 5, y + 0.5, 2, 'F');

  y += 8;

  // Group and print main deck cards
  const mainGroups = groupCardsByType(mainCards);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);

  for (const [groupName, cards] of Object.entries(mainGroups)) {
    if (y > 250) {
      doc.addPage();
      y = margin;
    }

    const groupTotal = cards.reduce((sum, c) => sum + c.quantity, 0);

    // Group header
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...red);
    doc.text(`${groupName} (${groupTotal})`, margin + 2, y);
    y += 4;

    // Cards
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const sorted = [...cards].sort((a, b) => a.cardName.localeCompare(b.cardName));
    for (const card of sorted) {
      if (y > 260) {
        doc.addPage();
        y = margin;
      }

      doc.text(`${card.quantity}x`, margin + 3, y);
      doc.text(card.cardName, margin + 12, y);
      if (card.manaCost) {
        const manaText = card.manaCost.replace(/[{}]/g, '');
        doc.setTextColor(120, 120, 120);
        doc.text(manaText, pageWidth - margin - 5, y, { align: 'right' });
        doc.setTextColor(0, 0, 0);
      }
      y += 3.5;
    }

    y += 2;
  }

  // Sideboard
  if (sideCards.length > 0) {
    y += 3;

    if (y > 240) {
      doc.addPage();
      y = margin;
    }

    // Sideboard header
    doc.setFillColor(...red);
    doc.rect(margin, y - 3, pageWidth - margin * 2, 7, 'F');
    doc.setTextColor(...white);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`SIDEBOARD (${sideTotal} cards)`, margin + 3, y + 1.5);

    const isSideValid = sideTotal <= DECK_LIMITS.SIDEBOARD_MAX;
    if (isSideValid) {
      doc.setFillColor(0, 128, 0);
    } else {
      doc.setFillColor(200, 0, 0);
    }
    doc.circle(pageWidth - margin - 5, y + 0.5, 2, 'F');

    y += 8;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    const sortedSide = [...sideCards].sort((a, b) => a.cardName.localeCompare(b.cardName));
    for (const card of sortedSide) {
      if (y > 260) {
        doc.addPage();
        y = margin;
      }

      doc.text(`${card.quantity}x`, margin + 3, y);
      doc.text(card.cardName, margin + 12, y);
      y += 3.5;
    }
  }

  // Footer
  y = doc.internal.pageSize.getHeight() - 15;
  doc.setFillColor(...red);
  doc.rect(0, y - 2, pageWidth, 20, 'F');
  doc.setFillColor(...gold);
  doc.rect(0, y - 2, pageWidth, 1, 'F');

  doc.setTextColor(...lightGray);
  doc.setFontSize(6);
  doc.text(
    'Magic: The Gathering is a trademark of Wizards of the Coast LLC. This tool is not affiliated with or endorsed by Wizards of the Coast.',
    pageWidth / 2,
    y + 4,
    { align: 'center' }
  );
  doc.text(
    `Generated by avsolem.com/magic | ${new Date().toLocaleDateString()}`,
    pageWidth / 2,
    y + 8,
    { align: 'center' }
  );

  // Save
  const safeName = deck.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  doc.save(`mtg_deck_${safeName}.pdf`);
}
