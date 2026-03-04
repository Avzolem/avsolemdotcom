'use client';

import { CardInList, ListType } from '@/types/magic';
import { exportToCSV, exportToPDF } from '@/lib/utils/exportMagicLists';
import { useMagicLanguage } from '@/contexts/MagicLanguageContext';
import styles from './ExportButtons.module.scss';

interface ExportButtonsProps {
  cards: CardInList[];
  listType: ListType;
}

export default function ExportButtons({ cards, listType }: ExportButtonsProps) {
  const { t } = useMagicLanguage();

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
          exportToCSV(cards, listType);
        }}
        title={t('export.csv.title')}
      >
        <span className={styles.icon}>&#x1F4CA;</span>
        {t('export.csv')}
      </button>
      <button
        type="button"
        className={styles.btnExport}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          exportToPDF(cards, listType);
        }}
        title={t('export.pdf.title')}
      >
        <span className={styles.icon}>&#x1F4C4;</span>
        {t('export.pdf')}
      </button>
    </div>
  );
}
