'use client';

import { useState } from 'react';
import { useMagicLanguage } from '@/contexts/MagicLanguageContext';
import { MTG_COLORS, COLOR_NAMES, COLOR_HEX, CARD_TYPES, RARITIES, RARITY_LABELS, FORMATS, FORMAT_LABELS } from '@/lib/constants/magic';
import styles from './AdvancedFilters.module.scss';

export interface MagicFilterOptions {
  colors?: string[];
  cardType?: string;
  cmcMin?: number;
  cmcMax?: number;
  rarity?: string;
  format?: string;
}

interface AdvancedFiltersProps {
  onFiltersChange: (query: string, filters: MagicFilterOptions) => void;
  onClear: () => void;
}

export default function AdvancedFilters({ onFiltersChange, onClear }: AdvancedFiltersProps) {
  const { t } = useMagicLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [cardType, setCardType] = useState('');
  const [cmcMin, setCmcMin] = useState<string>('');
  const [cmcMax, setCmcMax] = useState<string>('');
  const [rarity, setRarity] = useState('');
  const [format, setFormat] = useState('');

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const buildScryfallQuery = (): string => {
    const parts: string[] = [];

    // Colors
    if (selectedColors.length > 0) {
      const colorStr = selectedColors.join('');
      parts.push(`c:${colorStr}`);
    }

    // Card type
    if (cardType) {
      parts.push(`t:${cardType.toLowerCase()}`);
    }

    // CMC range
    if (cmcMin) {
      parts.push(`cmc>=${cmcMin}`);
    }
    if (cmcMax) {
      parts.push(`cmc<=${cmcMax}`);
    }

    // Rarity
    if (rarity) {
      parts.push(`r:${rarity}`);
    }

    // Format legality
    if (format) {
      parts.push(`f:${format}`);
    }

    return parts.join(' ');
  };

  const handleApply = () => {
    const query = buildScryfallQuery();
    const filters: MagicFilterOptions = {};

    if (selectedColors.length > 0) filters.colors = selectedColors;
    if (cardType) filters.cardType = cardType;
    if (cmcMin) filters.cmcMin = parseInt(cmcMin);
    if (cmcMax) filters.cmcMax = parseInt(cmcMax);
    if (rarity) filters.rarity = rarity;
    if (format) filters.format = format;

    onFiltersChange(query, filters);
    setIsExpanded(false);
  };

  const handleClear = () => {
    setSelectedColors([]);
    setCardType('');
    setCmcMin('');
    setCmcMax('');
    setRarity('');
    setFormat('');
    onClear();
    setIsExpanded(false);
  };

  const activeFilterCount = [
    selectedColors.length > 0,
    cardType !== '',
    cmcMin !== '',
    cmcMax !== '',
    rarity !== '',
    format !== '',
  ].filter(Boolean).length;

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
          {/* Color Checkboxes */}
          <div className={styles.colorSection}>
            <label className={styles.fieldLabel}>{t('filters.color')}</label>
            <div className={styles.colorGrid}>
              {MTG_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`${styles.colorButton} ${selectedColors.includes(color) ? styles.colorActive : ''}`}
                  onClick={() => toggleColor(color)}
                  title={COLOR_NAMES[color]}
                >
                  <span
                    className={styles.colorCircle}
                    style={{ backgroundColor: COLOR_HEX[color] }}
                  />
                  <span className={styles.colorLabel}>{COLOR_NAMES[color]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.grid}>
            {/* Card Type */}
            <div className={styles.field}>
              <label htmlFor="filter-cardtype">{t('filters.type')}</label>
              <select
                id="filter-cardtype"
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
              >
                <option value="">{t('filters.type.placeholder')}</option>
                {CARD_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* CMC Min */}
            <div className={styles.field}>
              <label>{t('filters.cmcMin')}</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                max="20"
                value={cmcMin}
                onChange={(e) => setCmcMin(e.target.value)}
              />
            </div>

            {/* CMC Max */}
            <div className={styles.field}>
              <label>{t('filters.cmcMax')}</label>
              <input
                type="number"
                placeholder="20"
                min="0"
                max="20"
                value={cmcMax}
                onChange={(e) => setCmcMax(e.target.value)}
              />
            </div>

            {/* Rarity */}
            <div className={styles.field}>
              <label htmlFor="filter-rarity">{t('filters.rarity')}</label>
              <select
                id="filter-rarity"
                value={rarity}
                onChange={(e) => setRarity(e.target.value)}
              >
                <option value="">{t('filters.rarity.placeholder')}</option>
                {RARITIES.map((r) => (
                  <option key={r} value={r}>{RARITY_LABELS[r] || r}</option>
                ))}
              </select>
            </div>

            {/* Format Legality */}
            <div className={styles.field}>
              <label htmlFor="filter-format">{t('filters.format')}</label>
              <select
                id="filter-format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="">{t('filters.format.placeholder')}</option>
                {FORMATS.map((f) => (
                  <option key={f} value={f}>{FORMAT_LABELS[f] || f}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnApply}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleApply(); }}
            >
              {t('filters.apply')}
            </button>
            <button
              type="button"
              className={styles.btnClear}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleClear(); }}
            >
              {t('filters.clear')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
