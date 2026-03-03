'use client';

import { CardInList } from '@/types/pokemon';
import { exportToCSV, exportToPDF } from '@/lib/utils/exportPokemonLists';
import { usePokemonLanguage } from '@/contexts/PokemonLanguageContext';
import styles from './ExportButtons.module.scss';

interface ExportButtonsProps {
  cards: CardInList[];
  listName: string;
  totalValue: number;
}

export default function ExportButtons({ cards, listName, totalValue }: ExportButtonsProps) {
  const { t } = usePokemonLanguage();

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
        title={t('export.csv.title')}
      >
        <span className={styles.icon}>📊</span>
        {t('export.csv')}
      </button>
      <button
        type="button"
        className={styles.btnExport}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          exportToPDF(cards, listName, totalValue);
        }}
        title={t('export.pdf.title')}
      >
        <span className={styles.icon}>📄</span>
        {t('export.pdf')}
      </button>
    </div>
  );
}
