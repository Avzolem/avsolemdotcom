import { CardInList } from '@/types/pokemon';
import { formatPrice } from '@/lib/services/pokemontcg';

/**
 * Export Pokemon card list to CSV format
 */
export function exportToCSV(cards: CardInList[], listName: string): void {
  if (cards.length === 0) {
    alert('No hay cartas para exportar');
    return;
  }

  // CSV headers
  const headers = ['Card ID', 'Card Name', 'Set ID', 'Set Name', 'Rarity', 'Quantity', 'Price (USD)', 'Added Date', 'Notes'];

  // CSV rows
  const rows = cards.map(card => [
    card.cardId,
    `"${card.cardName.replace(/"/g, '""')}"`,
    card.setCode,
    `"${card.setName.replace(/"/g, '""')}"`,
    `"${card.setRarity.replace(/"/g, '""')}"`,
    card.quantity,
    card.price || 0,
    new Date(card.addedAt).toLocaleDateString('es-MX'),
    card.notes ? `"${card.notes.replace(/"/g, '""')}"` : '',
  ]);

  // Calculate totals
  const totalCards = cards.reduce((sum, card) => sum + card.quantity, 0);
  const totalValue = cards.reduce((sum, card) => sum + (card.price || 0) * card.quantity, 0);

  // Add totals row
  rows.push(['', 'TOTAL', '', '', '', totalCards, totalValue.toFixed(2), '', '']);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${listName}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export Pokemon card list to PDF format using HTML print
 */
export function exportToPDF(cards: CardInList[], listName: string, totalValue: number): void {
  if (cards.length === 0) {
    alert('No hay cartas para exportar');
    return;
  }

  // Create printable HTML
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor permite ventanas emergentes para exportar a PDF');
    return;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${listName} - Pokemon TCG Manager</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }

    body {
      font-family: 'Arial', sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: #000;
      max-width: 100%;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 3px solid #EF4444;
      padding-bottom: 15px;
    }

    .header h1 {
      margin: 0;
      color: #EF4444;
      font-size: 24px;
    }

    .header p {
      margin: 5px 0;
      color: #666;
    }

    .summary {
      background: #f5f5f5;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 8px;
      display: flex;
      justify-content: space-around;
    }

    .summary-item {
      text-align: center;
    }

    .summary-label {
      font-weight: bold;
      color: #EF4444;
      font-size: 11px;
      text-transform: uppercase;
    }

    .summary-value {
      font-size: 18px;
      font-weight: bold;
      color: #000;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    th {
      background: #EF4444;
      color: white;
      padding: 10px 8px;
      text-align: left;
      font-weight: bold;
      font-size: 11px;
      text-transform: uppercase;
    }

    td {
      padding: 8px;
      border-bottom: 1px solid #ddd;
    }

    tr:nth-child(even) {
      background: #f9f9f9;
    }

    .footer {
      margin-top: 30px;
      text-align: center;
      color: #666;
      font-size: 10px;
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }

    .price {
      color: #22C55E;
      font-weight: bold;
    }

    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${listName}</h1>
    <p>Pokemon TCG Manager - Reporte de Coleccion</p>
    <p>Generado: ${new Date().toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
  </div>

  <div class="summary">
    <div class="summary-item">
      <div class="summary-label">Total de Cartas</div>
      <div class="summary-value">${cards.length}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Cantidad Total</div>
      <div class="summary-value">${cards.reduce((sum, card) => sum + card.quantity, 0)}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Valor Total</div>
      <div class="summary-value price">${formatPrice(totalValue)}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 12%;">Card ID</th>
        <th style="width: 22%;">Nombre de Carta</th>
        <th style="width: 15%;">Set</th>
        <th style="width: 12%;">Rareza</th>
        <th style="width: 8%;">Cant.</th>
        <th style="width: 10%;">Precio</th>
        <th style="width: 10%;">Total</th>
        <th style="width: 10%;">Fecha</th>
      </tr>
    </thead>
    <tbody>
      ${cards.map(card => `
        <tr>
          <td><code style="background: #f0f0f0; padding: 2px 4px; border-radius: 3px; font-size: 10px;">${card.cardId}</code></td>
          <td><strong>${card.cardName}</strong>${card.notes ? `<br><small style="color: #666;">${card.notes}</small>` : ''}</td>
          <td><small>${card.setName}</small></td>
          <td><small style="color: #EF4444; font-weight: bold;">${card.setRarity}</small></td>
          <td>${card.quantity}</td>
          <td class="price">${card.price ? formatPrice(card.price) : '-'}</td>
          <td class="price">${card.price ? formatPrice(card.price * card.quantity) : '-'}</td>
          <td><small>${new Date(card.addedAt).toLocaleDateString('es-MX')}</small></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    <p>Pokemon TCG Manager &copy; ${new Date().getFullYear()} - Los precios son estimados y pueden variar</p>
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
