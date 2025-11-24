'use client';

import { useState } from 'react';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
import styles from './AdvancedFilters.module.scss';

export interface FilterOptions {
  type?: string;
  race?: string;
  attribute?: string;
  level?: number;
  atkMin?: number;
  atkMax?: number;
  defMin?: number;
  defMax?: number;
}

interface AdvancedFiltersProps {
  onApplyFilters: (filters: FilterOptions) => void;
  onClear: () => void;
}

const CARD_TYPES = [
  // Main Deck Monsters
  'Effect Monster',
  'Flip Effect Monster',
  'Flip Tuner Effect Monster',
  'Gemini Monster',
  'Normal Monster',
  'Normal Tuner Monster',
  'Pendulum Effect Monster',
  'Pendulum Effect Ritual Monster',
  'Pendulum Flip Effect Monster',
  'Pendulum Normal Monster',
  'Pendulum Tuner Effect Monster',
  'Ritual Effect Monster',
  'Ritual Monster',
  'Spirit Monster',
  'Toon Monster',
  'Tuner Monster',
  'Union Effect Monster',
  // Extra Deck Monsters
  'Fusion Monster',
  'Link Monster',
  'Pendulum Effect Fusion Monster',
  'Synchro Monster',
  'Synchro Pendulum Effect Monster',
  'Synchro Tuner Monster',
  'XYZ Monster',
  'XYZ Pendulum Effect Monster',
  // Spells & Traps
  'Spell Card',
  'Trap Card',
  // Other
  'Skill Card',
  'Token',
].sort();

const MONSTER_TYPES = [
  'Aqua',
  'Beast',
  'Beast-Warrior',
  'Creator-God',
  'Cyberse',
  'Dinosaur',
  'Divine-Beast',
  'Dragon',
  'Fairy',
  'Fiend',
  'Fish',
  'Illusion',
  'Insect',
  'Machine',
  'Plant',
  'Psychic',
  'Pyro',
  'Reptile',
  'Rock',
  'Sea Serpent',
  'Spellcaster',
  'Thunder',
  'Warrior',
  'Winged Beast',
  'Wyrm',
  'Zombie',
].sort();

const ATTRIBUTES = [
  'DARK',
  'DIVINE',
  'EARTH',
  'FIRE',
  'LIGHT',
  'WATER',
  'WIND',
].sort();

export default function AdvancedFilters({ onApplyFilters, onClear }: AdvancedFiltersProps) {
  const { t } = useYugiohLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleApply = () => {
    const cleanFilters: FilterOptions = {};

    if (filters.type) cleanFilters.type = filters.type;
    if (filters.race) cleanFilters.race = filters.race;
    if (filters.attribute) cleanFilters.attribute = filters.attribute;
    if (filters.level) cleanFilters.level = filters.level;
    if (filters.atkMin !== undefined) cleanFilters.atkMin = filters.atkMin;
    if (filters.atkMax !== undefined) cleanFilters.atkMax = filters.atkMax;
    if (filters.defMin !== undefined) cleanFilters.defMin = filters.defMin;
    if (filters.defMax !== undefined) cleanFilters.defMax = filters.defMax;

    onApplyFilters(cleanFilters);
    setIsExpanded(false);
  };

  const handleClear = () => {
    setFilters({});
    onClear();
    setIsExpanded(false);
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key as keyof FilterOptions] !== undefined && filters[key as keyof FilterOptions] !== ''
  ).length;

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.toggleButton}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
      >
        <span className={styles.icon}>⚙️</span>
        {t('filters.title')}
        {activeFilterCount > 0 && (
          <span className={styles.badge}>{activeFilterCount}</span>
        )}
        <span className={styles.arrow}>{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div className={styles.panel}>
          <div className={styles.grid}>
            {/* Card Type */}
            <div className={styles.field}>
              <label htmlFor="filter-type">{t('filters.cardType')}</label>
              <select
                id="filter-type"
                value={filters.type || ''}
                onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
              >
                <option value="">{t('filters.cardType.placeholder')}</option>
                {CARD_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Monster Type/Race */}
            <div className={styles.field}>
              <label htmlFor="filter-race">{t('filters.monsterType')}</label>
              <select
                id="filter-race"
                value={filters.race || ''}
                onChange={(e) => setFilters({ ...filters, race: e.target.value || undefined })}
              >
                <option value="">{t('filters.monsterType.placeholder')}</option>
                {MONSTER_TYPES.map((race) => (
                  <option key={race} value={race}>
                    {race}
                  </option>
                ))}
              </select>
            </div>

            {/* Attribute */}
            <div className={styles.field}>
              <label htmlFor="filter-attribute">{t('filters.attribute')}</label>
              <select
                id="filter-attribute"
                value={filters.attribute || ''}
                onChange={(e) => setFilters({ ...filters, attribute: e.target.value || undefined })}
              >
                <option value="">{t('filters.attribute.placeholder')}</option>
                {ATTRIBUTES.map((attr) => (
                  <option key={attr} value={attr}>
                    {attr}
                  </option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div className={styles.field}>
              <label htmlFor="filter-level">{t('filters.level')}</label>
              <input
                type="number"
                id="filter-level"
                min="1"
                max="13"
                placeholder={t('filters.level.placeholder')}
                value={filters.level || ''}
                onChange={(e) =>
                  setFilters({ ...filters, level: e.target.value ? parseInt(e.target.value) : undefined })
                }
              />
            </div>

            {/* ATK Range */}
            <div className={styles.field}>
              <label>{t('filters.atk.min')}</label>
              <input
                type="number"
                placeholder={t('filters.atk.min')}
                value={filters.atkMin || ''}
                onChange={(e) =>
                  setFilters({ ...filters, atkMin: e.target.value ? parseInt(e.target.value) : undefined })
                }
              />
            </div>

            <div className={styles.field}>
              <label>{t('filters.atk.max')}</label>
              <input
                type="number"
                placeholder={t('filters.atk.max')}
                value={filters.atkMax || ''}
                onChange={(e) =>
                  setFilters({ ...filters, atkMax: e.target.value ? parseInt(e.target.value) : undefined })
                }
              />
            </div>

            {/* DEF Range */}
            <div className={styles.field}>
              <label>{t('filters.def.min')}</label>
              <input
                type="number"
                placeholder={t('filters.def.min')}
                value={filters.defMin || ''}
                onChange={(e) =>
                  setFilters({ ...filters, defMin: e.target.value ? parseInt(e.target.value) : undefined })
                }
              />
            </div>

            <div className={styles.field}>
              <label>{t('filters.def.max')}</label>
              <input
                type="number"
                placeholder={t('filters.def.max')}
                value={filters.defMax || ''}
                onChange={(e) =>
                  setFilters({ ...filters, defMax: e.target.value ? parseInt(e.target.value) : undefined })
                }
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnApply}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleApply();
              }}
            >
              {t('filters.apply')}
            </button>
            <button
              type="button"
              className={styles.btnClear}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClear();
              }}
            >
              {t('filters.clear')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
