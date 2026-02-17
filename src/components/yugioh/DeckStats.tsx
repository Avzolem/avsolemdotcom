'use client';

import { useMemo } from 'react';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
import { CardInDeck, DECK_LIMITS } from '@/types/yugioh';
import styles from './DeckStats.module.scss';

interface DeckStatsProps {
  cards: CardInDeck[];
}

export default function DeckStats({ cards }: DeckStatsProps) {
  const { t } = useYugiohLanguage();

  const stats = useMemo(() => {
    const main = cards.filter((c) => c.zone === 'main');
    const extra = cards.filter((c) => c.zone === 'extra');
    const side = cards.filter((c) => c.zone === 'side');

    const mainCount = main.reduce((s, c) => s + c.quantity, 0);
    const extraCount = extra.reduce((s, c) => s + c.quantity, 0);
    const sideCount = side.reduce((s, c) => s + c.quantity, 0);

    // Level curve (monsters only, main deck)
    const levelCurve: Record<number, number> = {};
    main.forEach((c) => {
      if (c.level && c.level > 0) {
        const lvl = Math.min(c.level, 12);
        levelCurve[lvl] = (levelCurve[lvl] || 0) + c.quantity;
      }
    });

    // Type distribution
    const typeDistribution: Record<string, number> = {};
    cards.forEach((c) => {
      if (c.zone !== 'side') {
        const typeName = c.cardType.includes('Monster')
          ? 'Monster'
          : c.cardType.includes('Spell')
            ? 'Spell'
            : c.cardType.includes('Trap')
              ? 'Trap'
              : 'Other';
        typeDistribution[typeName] = (typeDistribution[typeName] || 0) + c.quantity;
      }
    });

    // Attribute distribution (monsters only)
    const attributeDistribution: Record<string, number> = {};
    cards.forEach((c) => {
      if (c.attribute && c.zone !== 'side') {
        attributeDistribution[c.attribute] = (attributeDistribution[c.attribute] || 0) + c.quantity;
      }
    });

    const maxLevelCount = Math.max(...Object.values(levelCurve), 1);

    return {
      mainCount,
      extraCount,
      sideCount,
      levelCurve,
      maxLevelCount,
      typeDistribution,
      attributeDistribution,
    };
  }, [cards]);

  const mainValid = stats.mainCount >= DECK_LIMITS.MAIN_MIN;

  return (
    <div className={styles.container}>
      {/* Zone counts */}
      <div className={styles.zoneCounts}>
        <div className={`${styles.zoneCount} ${mainValid ? styles.valid : styles.invalid}`}>
          <span className={styles.zoneLabel}>Main</span>
          <span className={styles.zoneValue}>
            {stats.mainCount}/{DECK_LIMITS.MAIN_MIN}-{DECK_LIMITS.MAIN_MAX}
          </span>
        </div>
        <div className={`${styles.zoneCount} ${stats.extraCount <= DECK_LIMITS.EXTRA_MAX ? styles.valid : styles.invalid}`}>
          <span className={styles.zoneLabel}>Extra</span>
          <span className={styles.zoneValue}>
            {stats.extraCount}/{DECK_LIMITS.EXTRA_MAX}
          </span>
        </div>
        <div className={`${styles.zoneCount} ${stats.sideCount <= DECK_LIMITS.SIDE_MAX ? styles.valid : styles.invalid}`}>
          <span className={styles.zoneLabel}>Side</span>
          <span className={styles.zoneValue}>
            {stats.sideCount}/{DECK_LIMITS.SIDE_MAX}
          </span>
        </div>
      </div>

      {/* Level Curve */}
      {Object.keys(stats.levelCurve).length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('deck.stats.levelCurve')}</h4>
          <div className={styles.levelCurve}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((level) => {
              const count = stats.levelCurve[level] || 0;
              const height = count > 0 ? (count / stats.maxLevelCount) * 100 : 0;
              return (
                <div key={level} className={styles.levelBar}>
                  <div className={styles.barWrapper}>
                    <div
                      className={styles.bar}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className={styles.levelLabel}>{level}</span>
                  {count > 0 && <span className={styles.barCount}>{count}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Type Distribution */}
      {Object.keys(stats.typeDistribution).length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('deck.stats.typeDistribution')}</h4>
          <div className={styles.distribution}>
            {Object.entries(stats.typeDistribution).map(([type, count]) => (
              <div key={type} className={styles.distItem}>
                <span className={styles.distIcon}>
                  {type === 'Monster' ? '🐉' : type === 'Spell' ? '🪄' : type === 'Trap' ? '🪤' : '❓'}
                </span>
                <span className={styles.distLabel}>{type}</span>
                <span className={styles.distValue}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attribute Distribution */}
      {Object.keys(stats.attributeDistribution).length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('deck.stats.attributeDistribution')}</h4>
          <div className={styles.distribution}>
            {Object.entries(stats.attributeDistribution).map(([attr, count]) => (
              <div key={attr} className={styles.distItem}>
                <span className={styles.distLabel}>{attr}</span>
                <span className={styles.distValue}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
