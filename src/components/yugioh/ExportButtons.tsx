'use client';

import { CardInList } from '@/types/yugioh';
import { exportToCSV, exportToPDF } from '@/lib/utils/exportLists';
import styles from './ExportButtons.module.scss';

interface ExportButtonsProps {
  cards: CardInList[];
  listName: string;
  totalValue: number;
}

export default function ExportButtons({ cards, listName, totalValue }: ExportButtonsProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.btnExport}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          exportToCSV(cards, listName);
        }}
        title="Exportar a CSV"
      >
        <span className={styles.icon}>📊</span>
        Exportar CSV
      </button>
      <button
        type="button"
        className={styles.btnExport}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          exportToPDF(cards, listName, totalValue);
        }}
        title="Exportar a PDF"
      >
        <span className={styles.icon}>📄</span>
        Exportar PDF
      </button>
    </div>
  );
}
