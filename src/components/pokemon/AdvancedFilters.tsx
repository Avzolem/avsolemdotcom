'use client';

import { useState } from 'react';
import { usePokemonLanguage } from '@/contexts/PokemonLanguageContext';
import styles from './AdvancedFilters.module.scss';

export interface FilterOptions {
  supertype?: string;
  types?: string;
  subtypes?: string;
  hpMin?: number;
  hpMax?: number;
  rarity?: string;
  set?: string;
}

interface AdvancedFiltersProps {
  onApplyFilters: (filters: FilterOptions) => void;
  onClear: () => void;
}

const SUPERTYPES = [
  'Pokémon',
  'Trainer',
  'Energy',
];

const POKEMON_TYPES = [
  'Colorless',
  'Darkness',
  'Dragon',
  'Fairy',
  'Fighting',
  'Fire',
  'Grass',
  'Lightning',
  'Metal',
  'Psychic',
  'Water',
].sort();

const POKEMON_SUBTYPES = [
  'Basic',
  'BREAK',
  'EX',
  'GX',
  'Mega',
  'Stage 1',
  'Stage 2',
  'Tag Team',
  'V',
  'VMAX',
  'VSTAR',
].sort();

const RARITIES = [
  'Amazing Rare',
  'Common',
  'LEGEND',
  'Promo',
  'Rare',
  'Rare ACE',
  'Rare BREAK',
  'Rare Holo',
  'Rare Holo EX',
  'Rare Holo GX',
  'Rare Holo LV.X',
  'Rare Holo Star',
  'Rare Holo V',
  'Rare Holo VMAX',
  'Rare Holo VSTAR',
  'Rare Prime',
  'Rare Prism Star',
  'Rare Rainbow',
  'Rare Secret',
  'Rare Shining',
  'Rare Shiny',
  'Rare Shiny GX',
  'Rare Ultra',
  'Uncommon',
].sort();

export default function AdvancedFilters({ onApplyFilters, onClear }: AdvancedFiltersProps) {
  const { t } = usePokemonLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleApply = () => {
    const cleanFilters: FilterOptions = {};

    if (filters.supertype) cleanFilters.supertype = filters.supertype;
    if (filters.types) cleanFilters.types = filters.types;
    if (filters.subtypes) cleanFilters.subtypes = filters.subtypes;
    if (filters.hpMin !== undefined) cleanFilters.hpMin = filters.hpMin;
    if (filters.hpMax !== undefined) cleanFilters.hpMax = filters.hpMax;
    if (filters.rarity) cleanFilters.rarity = filters.rarity;
    if (filters.set) cleanFilters.set = filters.set;

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
        <span className={styles.icon}>&#x2699;&#xFE0F;</span>
        {t('filters.title')}
        {activeFilterCount > 0 && (
          <span className={styles.badge}>{activeFilterCount}</span>
        )}
        <span className={styles.arrow}>{isExpanded ? '\u25B2' : '\u25BC'}</span>
      </button>

      {isExpanded && (
        <div className={styles.panel}>
          <div className={styles.grid}>
            {/* Supertype */}
            <div className={styles.field}>
              <label htmlFor="filter-supertype">{t('filters.supertype')}</label>
              <select
                id="filter-supertype"
                value={filters.supertype || ''}
                onChange={(e) => setFilters({ ...filters, supertype: e.target.value || undefined })}
              >
                <option value="">{t('filters.supertype.placeholder')}</option>
                {SUPERTYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Energy Type */}
            <div className={styles.field}>
              <label htmlFor="filter-types">{t('filters.types')}</label>
              <select
                id="filter-types"
                value={filters.types || ''}
                onChange={(e) => setFilters({ ...filters, types: e.target.value || undefined })}
              >
                <option value="">{t('filters.types.placeholder')}</option>
                {POKEMON_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Subtype */}
            <div className={styles.field}>
              <label htmlFor="filter-subtypes">{t('filters.subtypes')}</label>
              <select
                id="filter-subtypes"
                value={filters.subtypes || ''}
                onChange={(e) => setFilters({ ...filters, subtypes: e.target.value || undefined })}
              >
                <option value="">{t('filters.subtypes.placeholder')}</option>
                {POKEMON_SUBTYPES.map((subtype) => (
                  <option key={subtype} value={subtype}>
                    {subtype}
                  </option>
                ))}
              </select>
            </div>

            {/* Rarity */}
            <div className={styles.field}>
              <label htmlFor="filter-rarity">{t('filters.rarity')}</label>
              <select
                id="filter-rarity"
                value={filters.rarity || ''}
                onChange={(e) => setFilters({ ...filters, rarity: e.target.value || undefined })}
              >
                <option value="">{t('filters.rarity.placeholder')}</option>
                {RARITIES.map((rarity) => (
                  <option key={rarity} value={rarity}>
                    {rarity}
                  </option>
                ))}
              </select>
            </div>

            {/* HP Min */}
            <div className={styles.field}>
              <label>{t('filters.hp.min')}</label>
              <input
                type="number"
                placeholder={t('filters.hp.min')}
                min="0"
                max="400"
                value={filters.hpMin ?? ''}
                onChange={(e) =>
                  setFilters({ ...filters, hpMin: e.target.value ? parseInt(e.target.value) : undefined })
                }
              />
            </div>

            {/* HP Max */}
            <div className={styles.field}>
              <label>{t('filters.hp.max')}</label>
              <input
                type="number"
                placeholder={t('filters.hp.max')}
                min="0"
                max="400"
                value={filters.hpMax ?? ''}
                onChange={(e) =>
                  setFilters({ ...filters, hpMax: e.target.value ? parseInt(e.target.value) : undefined })
                }
              />
            </div>

            {/* Set (text input) */}
            <div className={styles.field}>
              <label htmlFor="filter-set">{t('filters.set')}</label>
              <input
                type="text"
                id="filter-set"
                placeholder={t('filters.set.placeholder')}
                value={filters.set || ''}
                onChange={(e) => setFilters({ ...filters, set: e.target.value || undefined })}
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
