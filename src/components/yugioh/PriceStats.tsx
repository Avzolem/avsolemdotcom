'use client';

import { CardInList } from '@/types/yugioh';
import { formatPrice } from '@/lib/services/ygoprodeck';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
import styles from './PriceStats.module.scss';

interface PriceStatsProps {
  cards: CardInList[];
}

export default function PriceStats({ cards }: PriceStatsProps) {
  const { t } = useYugiohLanguage();
  if (cards.length === 0) {
    return null;
  }

  // Calculate statistics
  const cardsWithPrice = cards.filter(card => card.price && card.price > 0);

  if (cardsWithPrice.length === 0) {
    return null;
  }

  const totalValue = cards.reduce((sum, card) => sum + (card.price || 0) * card.quantity, 0);
  const averagePrice = totalValue / cards.reduce((sum, card) => sum + card.quantity, 0);

  const mostExpensive = [...cardsWithPrice].sort((a, b) =>
    (b.price || 0) - (a.price || 0)
  )[0];

  const leastExpensive = [...cardsWithPrice].sort((a, b) =>
    (a.price || 0) - (b.price || 0)
  )[0];

  const priceRanges = {
    under1: cardsWithPrice.filter(c => (c.price || 0) < 1).length,
    under5: cardsWithPrice.filter(c => (c.price || 0) >= 1 && (c.price || 0) < 5).length,
    under10: cardsWithPrice.filter(c => (c.price || 0) >= 5 && (c.price || 0) < 10).length,
    under50: cardsWithPrice.filter(c => (c.price || 0) >= 10 && (c.price || 0) < 50).length,
    over50: cardsWithPrice.filter(c => (c.price || 0) >= 50).length,
  };

  const maxRange = Math.max(...Object.values(priceRanges));

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t('stats.title')}</h3>

      <div className={styles.grid}>
        {/* Main Stats */}
        <div className={styles.statCard}>
          <div className={styles.statLabel}>{t('stats.total')}</div>
          <div className={styles.statValue}>{formatPrice(totalValue)}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>{t('stats.average')}</div>
          <div className={styles.statValue}>{formatPrice(averagePrice)}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>{t('stats.highest')}</div>
          <div className={styles.statValue}>{formatPrice(mostExpensive.price || 0)}</div>
          <div className={styles.statSubtext}>{mostExpensive.cardName}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>{t('stats.lowest')}</div>
          <div className={styles.statValue}>{formatPrice(leastExpensive.price || 0)}</div>
          <div className={styles.statSubtext}>{leastExpensive.cardName}</div>
        </div>
      </div>

      {/* Price Distribution */}
      <div className={styles.distribution}>
        <h4 className={styles.subtitle}>{t('stats.distribution')}</h4>
        <div className={styles.chart}>
          <div className={styles.chartRow}>
            <div className={styles.chartLabel}>{t('stats.priceRange.under1')}</div>
            <div className={styles.chartBarContainer}>
              <div
                className={styles.chartBar}
                style={{ width: maxRange > 0 ? `${(priceRanges.under1 / maxRange) * 100}%` : '0%' }}
              />
              <span className={styles.chartValue}>{priceRanges.under1}</span>
            </div>
          </div>

          <div className={styles.chartRow}>
            <div className={styles.chartLabel}>{t('stats.priceRange.1to5')}</div>
            <div className={styles.chartBarContainer}>
              <div
                className={styles.chartBar}
                style={{ width: maxRange > 0 ? `${(priceRanges.under5 / maxRange) * 100}%` : '0%' }}
              />
              <span className={styles.chartValue}>{priceRanges.under5}</span>
            </div>
          </div>

          <div className={styles.chartRow}>
            <div className={styles.chartLabel}>{t('stats.priceRange.5to10')}</div>
            <div className={styles.chartBarContainer}>
              <div
                className={styles.chartBar}
                style={{ width: maxRange > 0 ? `${(priceRanges.under10 / maxRange) * 100}%` : '0%' }}
              />
              <span className={styles.chartValue}>{priceRanges.under10}</span>
            </div>
          </div>

          <div className={styles.chartRow}>
            <div className={styles.chartLabel}>{t('stats.priceRange.10to50')}</div>
            <div className={styles.chartBarContainer}>
              <div
                className={styles.chartBar}
                style={{ width: maxRange > 0 ? `${(priceRanges.under50 / maxRange) * 100}%` : '0%' }}
              />
              <span className={styles.chartValue}>{priceRanges.under50}</span>
            </div>
          </div>

          <div className={styles.chartRow}>
            <div className={styles.chartLabel}>{t('stats.priceRange.over50')}</div>
            <div className={styles.chartBarContainer}>
              <div
                className={styles.chartBar}
                style={{ width: maxRange > 0 ? `${(priceRanges.over50 / maxRange) * 100}%` : '0%' }}
              />
              <span className={styles.chartValue}>{priceRanges.over50}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.note}>
        {t('stats.note')}
      </div>
    </div>
  );
}
