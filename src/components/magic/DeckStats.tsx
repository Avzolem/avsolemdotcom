'use client';

import { useMemo } from 'react';
import { useMagicLanguage } from '@/contexts/MagicLanguageContext';
import { CardInDeck, DECK_LIMITS, getPrimaryType } from '@/types/magic';
import { COLOR_NAMES, COLOR_HEX } from '@/lib/constants/magic';
import styles from './DeckStats.module.scss';

interface DeckStatsProps {
  cards: CardInDeck[];
}

export default function DeckStats({ cards }: DeckStatsProps) {
  const { t } = useMagicLanguage();

  const stats = useMemo(() => {
    const mainCards = cards.filter((c) => c.zone === 'main');
    const sideCards = cards.filter((c) => c.zone === 'sideboard');

    const mainCount = mainCards.reduce((s, c) => s + c.quantity, 0);
    const sideCount = sideCards.reduce((s, c) => s + c.quantity, 0);
    const totalCount = mainCount + sideCount;

    // Mana Curve (CMC distribution for main deck non-land cards)
    const cmcCurve: Record<string, number> = {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7+': 0,
    };

    let totalCmc = 0;
    let nonLandCount = 0;

    mainCards.forEach((c) => {
      const type = getPrimaryType(c.cardType);
      if (type !== 'Land') {
        const cmc = c.cmc ?? 0;
        totalCmc += cmc * c.quantity;
        nonLandCount += c.quantity;

        if (cmc >= 7) {
          cmcCurve['7+'] += c.quantity;
        } else {
          cmcCurve[String(cmc)] += c.quantity;
        }
      }
    });

    const avgCmc = nonLandCount > 0 ? totalCmc / nonLandCount : 0;
    const maxCmcCount = Math.max(...Object.values(cmcCurve), 1);

    // Color distribution (main deck only)
    const colorDistribution: Record<string, number> = {};
    mainCards.forEach((c) => {
      if (c.colors && c.colors.length > 0) {
        c.colors.forEach((color) => {
          colorDistribution[color] = (colorDistribution[color] || 0) + c.quantity;
        });
      }
    });

    // Type distribution (main deck only)
    const typeDistribution: Record<string, number> = {};
    mainCards.forEach((c) => {
      const type = getPrimaryType(c.cardType);
      typeDistribution[type] = (typeDistribution[type] || 0) + c.quantity;
    });

    return {
      mainCount,
      sideCount,
      totalCount,
      cmcCurve,
      maxCmcCount,
      avgCmc,
      colorDistribution,
      typeDistribution,
    };
  }, [cards]);

  const mainValid = stats.mainCount >= DECK_LIMITS.MAIN_MIN;
  const sideValid = stats.sideCount <= DECK_LIMITS.SIDEBOARD_MAX;

  const getTypeIcon = (type: string): string => {
    const typeIcons: Record<string, string> = {
      Creature: '\u{2694}',
      Instant: '\u{26A1}',
      Sorcery: '\u{1F4AB}',
      Enchantment: '\u{2728}',
      Artifact: '\u{2699}',
      Planeswalker: '\u{1F451}',
      Land: '\u{1F30D}',
      Battle: '\u{1F6E1}',
    };
    return typeIcons[type] || '\u{2753}';
  };

  return (
    <div className={styles.container}>
      {/* Zone counts */}
      <div className={styles.zoneCounts}>
        <div className={`${styles.zoneCount} ${mainValid ? styles.valid : styles.invalid}`}>
          <span className={styles.zoneLabel}>{t('deck.main')}</span>
          <span className={styles.zoneValue}>{stats.mainCount}</span>
        </div>
        <div className={`${styles.zoneCount} ${sideValid ? styles.valid : styles.invalid}`}>
          <span className={styles.zoneLabel}>{t('deck.sideboard')}</span>
          <span className={styles.zoneValue}>{stats.sideCount}</span>
        </div>
      </div>

      {/* Total */}
      <div className={`${styles.totalCount} ${mainValid ? styles.totalValid : styles.totalInvalid}`}>
        <span className={styles.totalLabel}>{t('deck.stats.total')}</span>
        <span className={styles.totalValue}>{stats.mainCount}/{DECK_LIMITS.MAIN_MIN}+</span>
      </div>

      {/* Average CMC */}
      {stats.avgCmc > 0 && (
        <div className={styles.avgCmc}>
          <span className={styles.avgCmcLabel}>{t('deck.stats.averageCmc')}</span>
          <span className={styles.avgCmcValue}>{stats.avgCmc.toFixed(2)}</span>
        </div>
      )}

      {/* Mana Curve */}
      {Object.values(stats.cmcCurve).some((v) => v > 0) && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('deck.stats.manaCurve')}</h4>
          <div className={styles.manaCurve}>
            {Object.entries(stats.cmcCurve).map(([cmc, count]) => {
              const height = count > 0 ? (count / stats.maxCmcCount) * 100 : 0;
              return (
                <div key={cmc} className={styles.cmcBar}>
                  <div className={styles.barWrapper}>
                    <div
                      className={styles.bar}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className={styles.cmcLabel}>{cmc}</span>
                  {count > 0 && <span className={styles.barCount}>{count}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Distribution */}
      {Object.keys(stats.colorDistribution).length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('deck.stats.colorDistribution')}</h4>
          <div className={styles.distribution}>
            {Object.entries(stats.colorDistribution).map(([color, count]) => (
              <div key={color} className={styles.distItem}>
                <span
                  className={styles.colorDot}
                  style={{ backgroundColor: COLOR_HEX[color] || '#999' }}
                />
                <span className={styles.distLabel}>{COLOR_NAMES[color] || color}</span>
                <span className={styles.distValue}>{count}</span>
              </div>
            ))}
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
                <span className={styles.distIcon}>{getTypeIcon(type)}</span>
                <span className={styles.distLabel}>{type}</span>
                <span className={styles.distValue}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
