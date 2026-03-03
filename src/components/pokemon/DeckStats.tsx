'use client';

import { useMemo } from 'react';
import { usePokemonLanguage } from '@/contexts/PokemonLanguageContext';
import { CardInDeck, DECK_LIMITS } from '@/types/pokemon';
import styles from './DeckStats.module.scss';

interface DeckStatsProps {
  cards: CardInDeck[];
}

export default function DeckStats({ cards }: DeckStatsProps) {
  const { t } = usePokemonLanguage();

  const stats = useMemo(() => {
    const pokemon = cards.filter((c) => c.zone === 'pokemon');
    const trainer = cards.filter((c) => c.zone === 'trainer');
    const energy = cards.filter((c) => c.zone === 'energy');

    const pokemonCount = pokemon.reduce((s, c) => s + c.quantity, 0);
    const trainerCount = trainer.reduce((s, c) => s + c.quantity, 0);
    const energyCount = energy.reduce((s, c) => s + c.quantity, 0);
    const totalCount = pokemonCount + trainerCount + energyCount;

    // HP Distribution (Pokemon cards only)
    const hpRanges: Record<string, number> = {
      '0-50': 0,
      '60-90': 0,
      '100-130': 0,
      '140-170': 0,
      '180+': 0,
    };
    pokemon.forEach((c) => {
      if (c.hp) {
        const hp = parseInt(c.hp, 10);
        if (!isNaN(hp)) {
          if (hp <= 50) hpRanges['0-50'] += c.quantity;
          else if (hp <= 90) hpRanges['60-90'] += c.quantity;
          else if (hp <= 130) hpRanges['100-130'] += c.quantity;
          else if (hp <= 170) hpRanges['140-170'] += c.quantity;
          else hpRanges['180+'] += c.quantity;
        }
      }
    });

    const maxHpCount = Math.max(...Object.values(hpRanges), 1);

    // Type distribution (Pokemon types - Fire, Water, Grass, etc.)
    const typeDistribution: Record<string, number> = {};
    pokemon.forEach((c) => {
      if (c.types && c.types.length > 0) {
        c.types.forEach((type) => {
          typeDistribution[type] = (typeDistribution[type] || 0) + c.quantity;
        });
      }
    });

    // Category distribution (Pokemon / Trainer / Energy)
    const categoryDistribution: Record<string, number> = {};
    if (pokemonCount > 0) categoryDistribution['Pokemon'] = pokemonCount;
    if (trainerCount > 0) categoryDistribution['Trainer'] = trainerCount;
    if (energyCount > 0) categoryDistribution['Energy'] = energyCount;

    return {
      pokemonCount,
      trainerCount,
      energyCount,
      totalCount,
      hpRanges,
      maxHpCount,
      typeDistribution,
      categoryDistribution,
    };
  }, [cards]);

  const deckValid = stats.totalCount === DECK_LIMITS.DECK_SIZE;

  // Map Pokemon type names to emoji icons
  const getTypeIcon = (type: string): string => {
    const typeIcons: Record<string, string> = {
      Fire: '\u{1F525}',
      Water: '\u{1F4A7}',
      Grass: '\u{1F33F}',
      Lightning: '\u{26A1}',
      Psychic: '\u{1F52E}',
      Fighting: '\u{1F4AA}',
      Darkness: '\u{1F31A}',
      Metal: '\u{1F529}',
      Fairy: '\u{2728}',
      Dragon: '\u{1F409}',
      Colorless: '\u{26AA}',
    };
    return typeIcons[type] || '\u{2753}';
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'Pokemon': return '\u{26A1}';
      case 'Trainer': return '\u{1F3B4}';
      case 'Energy': return '\u{1F525}';
      default: return '\u{2753}';
    }
  };

  return (
    <div className={styles.container}>
      {/* Zone counts */}
      <div className={styles.zoneCounts}>
        <div className={`${styles.zoneCount} ${stats.pokemonCount > 0 ? styles.valid : styles.invalid}`}>
          <span className={styles.zoneLabel}>Pokemon</span>
          <span className={styles.zoneValue}>{stats.pokemonCount}</span>
        </div>
        <div className={`${styles.zoneCount} ${styles.valid}`}>
          <span className={styles.zoneLabel}>Trainer</span>
          <span className={styles.zoneValue}>{stats.trainerCount}</span>
        </div>
        <div className={`${styles.zoneCount} ${styles.valid}`}>
          <span className={styles.zoneLabel}>Energy</span>
          <span className={styles.zoneValue}>{stats.energyCount}</span>
        </div>
      </div>

      {/* Total */}
      <div className={`${styles.totalCount} ${deckValid ? styles.totalValid : styles.totalInvalid}`}>
        <span className={styles.totalLabel}>{t('deck.stats.total')}</span>
        <span className={styles.totalValue}>{stats.totalCount}/{DECK_LIMITS.DECK_SIZE}</span>
      </div>

      {/* HP Distribution */}
      {Object.values(stats.hpRanges).some((v) => v > 0) && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('deck.stats.hpDistribution')}</h4>
          <div className={styles.hpCurve}>
            {Object.entries(stats.hpRanges).map(([range, count]) => {
              const height = count > 0 ? (count / stats.maxHpCount) * 100 : 0;
              return (
                <div key={range} className={styles.hpBar}>
                  <div className={styles.barWrapper}>
                    <div
                      className={styles.bar}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className={styles.hpLabel}>{range}</span>
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
                <span className={styles.distIcon}>{getTypeIcon(type)}</span>
                <span className={styles.distLabel}>{type}</span>
                <span className={styles.distValue}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Distribution */}
      {Object.keys(stats.categoryDistribution).length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('deck.stats.categoryDistribution')}</h4>
          <div className={styles.distribution}>
            {Object.entries(stats.categoryDistribution).map(([category, count]) => (
              <div key={category} className={styles.distItem}>
                <span className={styles.distIcon}>{getCategoryIcon(category)}</span>
                <span className={styles.distLabel}>{category}</span>
                <span className={styles.distValue}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
