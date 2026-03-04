'use client';

import { useState, memo } from 'react';
import { useMagicLanguage } from '@/contexts/MagicLanguageContext';
import { useMagicAuth } from '@/contexts/MagicAuthContext';
import { useToast } from '@/contexts/ToastContext';
import { MagicCard, ListType, parseManaSymbols, getPrimaryType } from '@/types/magic';
import { RARITY_COLORS, RARITY_LABELS, COLOR_HEX, COLOR_NAMES, FORMAT_LABELS } from '@/lib/constants/magic';
import Image from 'next/image';
import styles from './CardDisplay.module.scss';

// Mana symbol color mapping
const MANA_SYMBOL_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  W: { bg: '#F9FAF4', color: '#1a1a1a', border: '#d4c894' },
  U: { bg: '#0E68AB', color: '#ffffff', border: '#0a5088' },
  B: { bg: '#150B00', color: '#c0b5a0', border: '#3d2b15' },
  R: { bg: '#D3202A', color: '#ffffff', border: '#a01820' },
  G: { bg: '#00733E', color: '#ffffff', border: '#005530' },
  C: { bg: '#ccc2b6', color: '#1a1a1a', border: '#9e9589' },
};

function getManaSymbolStyle(symbol: string): React.CSSProperties {
  // Generic/colorless mana
  if (/^\d+$/.test(symbol) || symbol === 'X') {
    return {
      background: '#ccc2b6',
      color: '#1a1a1a',
      borderColor: '#9e9589',
    };
  }

  // Hybrid mana (e.g., "W/U")
  if (symbol.includes('/')) {
    const parts = symbol.split('/');
    const c1 = MANA_SYMBOL_COLORS[parts[0]];
    const c2 = MANA_SYMBOL_COLORS[parts[1]];
    if (c1 && c2) {
      return {
        background: `linear-gradient(135deg, ${c1.bg} 50%, ${c2.bg} 50%)`,
        color: '#ffffff',
        borderColor: c1.border,
      };
    }
  }

  const colors = MANA_SYMBOL_COLORS[symbol];
  if (colors) {
    return {
      background: colors.bg,
      color: colors.color,
      borderColor: colors.border,
    };
  }

  return {
    background: '#ccc2b6',
    color: '#1a1a1a',
    borderColor: '#9e9589',
  };
}

function getRarityStyle(rarity: string): React.CSSProperties {
  const color = RARITY_COLORS[rarity] || '#9CA3AF';
  return {
    background: `${color}22`,
    borderColor: `${color}88`,
    color: color === '#1a1a1a' ? '#9CA3AF' : color,
  };
}

// Legality badge colors
function getLegalityStyle(legality: string): React.CSSProperties {
  switch (legality) {
    case 'legal':
      return { background: 'rgba(34, 197, 94, 0.2)', color: '#22C55E', borderColor: 'rgba(34, 197, 94, 0.4)' };
    case 'not_legal':
      return { background: 'rgba(100, 100, 100, 0.2)', color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(100,100,100,0.4)' };
    case 'banned':
      return { background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)' };
    case 'restricted':
      return { background: 'rgba(250, 204, 21, 0.2)', color: '#FACC15', borderColor: 'rgba(250, 204, 21, 0.4)' };
    default:
      return { background: 'rgba(100, 100, 100, 0.2)', color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(100,100,100,0.4)' };
  }
}

interface CardDisplayProps {
  card: MagicCard;
  onAddToCollection?: (card: MagicCard) => void;
  onAddToWishlist?: (card: MagicCard) => void;
  onAddToForSale?: (card: MagicCard) => void;
  onAddToDeck?: (card: MagicCard) => void;
  showActions?: boolean;
}

function CardDisplay({
  card,
  onAddToCollection,
  onAddToWishlist,
  onAddToForSale,
  onAddToDeck,
  showActions = true,
}: CardDisplayProps) {
  const { t } = useMagicLanguage();
  const { isAuthenticated } = useMagicAuth();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [showingBack, setShowingBack] = useState(false);
  const [isLegalitiesExpanded, setIsLegalitiesExpanded] = useState(false);

  const manaSymbols = parseManaSymbols(card.manaCost);
  const primaryType = getPrimaryType(card.typeLine);
  const isCreature = primaryType === 'Creature';
  const isPlaneswalker = primaryType === 'Planeswalker';

  // Get current face data for double-faced cards
  const currentFace = card.isDoubleFaced && card.cardFaces
    ? card.cardFaces[showingBack ? 1 : 0]
    : null;

  const currentImage = card.isDoubleFaced && currentFace?.images
    ? (showingBack ? currentFace.images.large : card.images.large)
    : card.images.large;

  const currentSmallImage = card.isDoubleFaced && currentFace?.images
    ? (showingBack ? currentFace.images.small : card.images.small)
    : card.images.small;

  const addToList = async (type: ListType) => {
    if (onAddToCollection && type === 'collection') {
      onAddToCollection(card);
      return;
    }
    if (onAddToWishlist && type === 'wishlist') {
      onAddToWishlist(card);
      return;
    }
    if (onAddToForSale && type === 'for-sale') {
      onAddToForSale(card);
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch(`/api/magic/lists/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: card.id,
          cardName: card.name,
          cardImage: card.images.small,
          setCode: card.set,
          setName: card.setName,
          setRarity: card.rarity,
          quantity: 1,
          price: card.prices.usd,
        }),
      });

      if (response.ok) {
        const listName = type === 'collection' ? t('header.collection')
          : type === 'for-sale' ? t('header.forSale')
          : t('header.wishlist');

        showToast(
          <>
            {'+ '}<span style={{ color: '#D4AF37', fontWeight: 700 }}>{card.name}</span>
            {' '}{t('toast.added')} {listName}
          </>,
          'success'
        );
      } else {
        showToast(t('toast.error.add'), 'error');
      }
    } catch (error) {
      console.error('Error adding card:', error);
      showToast(t('toast.error.add'), 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddToDeck = () => {
    if (onAddToDeck) {
      onAddToDeck(card);
    }
  };

  // Key legality formats to show
  const keyFormats = ['standard', 'pioneer', 'modern', 'legacy', 'vintage', 'commander', 'pauper'];

  return (
    <div className={styles.card}>
      {/* Card image */}
      <div className={styles.imageWrapper}>
        <div className={styles.imageContainer}>
          {currentSmallImage && (
            <Image
              src={currentSmallImage}
              alt={card.name}
              width={100}
              height={140}
              className={styles.cardImage}
              unoptimized
            />
          )}
          {card.isDoubleFaced && (
            <button
              type="button"
              className={styles.flipButton}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowingBack(!showingBack);
              }}
              title={showingBack ? t('card.showFront') : t('card.showBack')}
            >
              &#x21BB;
            </button>
          )}
        </div>
        {/* Hover preview */}
        {currentImage && (
          <div className={styles.imageZoomOverlay}>
            <Image
              src={currentImage}
              alt={card.name}
              width={300}
              height={419}
              className={styles.largeImage}
              unoptimized
            />
          </div>
        )}
      </div>

      {/* Card content */}
      <div className={styles.cardContent}>
        {/* Header: Name + Mana cost */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <h2 className={styles.cardTitle}>{currentFace ? currentFace.name : card.name}</h2>
            {manaSymbols.length > 0 && (
              <div className={styles.manaCost}>
                {manaSymbols.map((symbol, idx) => (
                  <span
                    key={idx}
                    className={styles.manaSymbol}
                    style={getManaSymbolStyle(symbol)}
                    title={COLOR_NAMES[symbol] || symbol}
                  >
                    {symbol}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Type line */}
          <p className={styles.typeLine}>
            {currentFace ? currentFace.typeLine : card.typeLine}
          </p>
        </div>

        {/* Oracle text */}
        {(currentFace?.oracleText || card.oracleText) && (
          <div className={styles.oracleSection}>
            <p className={styles.oracleText}>
              {currentFace ? currentFace.oracleText : card.oracleText}
            </p>
          </div>
        )}

        {/* Power/Toughness or Loyalty */}
        {isCreature && (card.power || card.toughness) && (
          <div className={styles.ptBox}>
            <span className={styles.ptLabel}>{t('card.pt')}:</span>
            <span className={styles.ptValue}>{card.power}/{card.toughness}</span>
          </div>
        )}

        {isPlaneswalker && card.loyalty && (
          <div className={styles.loyaltyBox}>
            <span className={styles.loyaltyLabel}>{t('card.loyalty')}:</span>
            <span className={styles.loyaltyValue}>{card.loyalty}</span>
          </div>
        )}

        {/* Flavor text */}
        {(currentFace?.flavorText || card.flavorText) && (
          <div className={styles.flavorSection}>
            <p className={styles.flavorText}>
              {currentFace ? currentFace.flavorText : card.flavorText}
            </p>
          </div>
        )}

        {/* Set info, rarity, artist */}
        <div className={styles.codesSection}>
          <div className={styles.codeItem}>
            <strong>{t('card.set')}:</strong>
            <span className={styles.setName}>{card.setName}</span>
          </div>
          <div className={styles.codeItem}>
            <strong>{t('card.collector')}:</strong>
            <span className={styles.codeValue}>{card.collectorNumber}</span>
          </div>
          <div className={styles.codeItem}>
            <strong>{t('card.rarity')}:</strong>
            <span className={styles.rarityBadge} style={getRarityStyle(card.rarity)}>
              {RARITY_LABELS[card.rarity] || card.rarity}
            </span>
          </div>
          {(currentFace?.artist || card.artist) && (
            <div className={styles.codeItem}>
              <strong>{t('card.artist')}:</strong>
              <span className={styles.artistValue}>
                {currentFace ? currentFace.artist : card.artist}
              </span>
            </div>
          )}
        </div>

        {/* Legalities */}
        <div className={styles.legalitiesSection}>
          <button
            type="button"
            className={styles.legalitiesToggle}
            onClick={() => setIsLegalitiesExpanded(!isLegalitiesExpanded)}
          >
            {t('card.legalities')}
            <span className={styles.arrow}>{isLegalitiesExpanded ? '\u25B2' : '\u25BC'}</span>
          </button>
          {isLegalitiesExpanded && (
            <div className={styles.legalitiesGrid}>
              {keyFormats.map((format) => {
                const legality = card.legalities[format] || 'not_legal';
                return (
                  <span
                    key={format}
                    className={styles.legalityBadge}
                    style={getLegalityStyle(legality)}
                  >
                    {FORMAT_LABELS[format] || format}: {legality.replace('_', ' ')}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Prices */}
        <div className={styles.priceSection}>
          <span className={styles.priceLabel}>{t('card.prices')}:</span>
          <div className={styles.priceGrid}>
            {card.prices.usd > 0 && (
              <span className={styles.priceValue}>USD ${card.prices.usd.toFixed(2)}</span>
            )}
            {card.prices.usdFoil > 0 && (
              <span className={styles.priceFoil}>Foil ${card.prices.usdFoil.toFixed(2)}</span>
            )}
            {card.prices.eur > 0 && (
              <span className={styles.priceEur}>EUR {card.prices.eur.toFixed(2)}</span>
            )}
            {card.prices.usd === 0 && card.prices.usdFoil === 0 && card.prices.eur === 0 && (
              <span className={styles.priceUnavailable}>{t('card.price.unavailable')}</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {showActions && isAuthenticated && (
          <div className={styles.actions}>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.addButton}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToList('collection'); }}
                disabled={isAdding}
              >
                {isAdding ? '...' : `+ ${t('header.collection')}`}
              </button>
              <button
                type="button"
                className={styles.addButton}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToList('wishlist'); }}
                disabled={isAdding}
              >
                {isAdding ? '...' : `+ ${t('header.wishlist')}`}
              </button>
              <button
                type="button"
                className={styles.addButton}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToList('for-sale'); }}
                disabled={isAdding}
              >
                {isAdding ? '...' : `+ ${t('header.forSale')}`}
              </button>
              {onAddToDeck && (
                <button
                  type="button"
                  className={`${styles.addButton} ${styles.addToDeckButton}`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToDeck(); }}
                  disabled={isAdding}
                >
                  {isAdding ? '...' : `+ ${t('card.addToDeck')}`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(CardDisplay, (prevProps, nextProps) => {
  return prevProps.card.id === nextProps.card.id;
});
