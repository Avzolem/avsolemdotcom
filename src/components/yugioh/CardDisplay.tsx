'use client';

import { useState, memo } from 'react';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
import { YugiohCard, ListType, CardSet } from '@/types/yugioh';
import { getCardPrice, formatPrice } from '@/lib/services/ygoprodeck';
import { useYugiohAuth } from '@/contexts/YugiohAuthContext';
import { useToast } from '@/contexts/ToastContext';
import Image from 'next/image';
import styles from './CardDisplay.module.scss';

// Helper function to convert card type to CSS class name
function getTypeClassName(type: string): string {
  // Remove spaces and special characters, convert to camelCase
  return type
    .replace(/\s+/g, '')
    .replace(/-/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .replace(/^./, (str) => str.toLowerCase());
}

// Rarity configuration with icons and colors
const RARITY_CONFIG: Record<string, { icon: string; className: string; label: string }> = {
  // Common rarities
  'Common': { icon: '○', className: 'rarityCommon', label: 'C' },
  'Short Print': { icon: '○', className: 'rarityCommon', label: 'SP' },

  // Rare
  'Rare': { icon: '◆', className: 'rarityRare', label: 'R' },

  // Super Rare
  'Super Rare': { icon: '★', className: 'raritySuperRare', label: 'SR' },
  'Super Short Print': { icon: '★', className: 'raritySuperRare', label: 'SSP' },

  // Ultra Rare
  'Ultra Rare': { icon: '★', className: 'rarityUltraRare', label: 'UR' },
  'Ultra Rare (Pharaoh\'s Rare)': { icon: '★', className: 'rarityUltraRare', label: 'UR' },

  // Secret Rare
  'Secret Rare': { icon: '✦', className: 'raritySecretRare', label: 'ScR' },
  'Prismatic Secret Rare': { icon: '✦', className: 'raritySecretRare', label: 'PScR' },
  'Extra Secret Rare': { icon: '✦', className: 'raritySecretRare', label: 'EScR' },
  '20th Secret Rare': { icon: '✦', className: 'raritySecretRare', label: '20ScR' },
  '10000 Secret Rare': { icon: '✦', className: 'raritySecretRare', label: '10000ScR' },

  // Ultimate Rare
  'Ultimate Rare': { icon: '◈', className: 'rarityUltimateRare', label: 'UtR' },

  // Ghost Rare
  'Ghost Rare': { icon: '👻', className: 'rarityGhostRare', label: 'GR' },
  'Ghost/Gold Rare': { icon: '👻', className: 'rarityGhostRare', label: 'GGR' },

  // Gold Rare
  'Gold Rare': { icon: '✧', className: 'rarityGoldRare', label: 'GUR' },
  'Gold Secret Rare': { icon: '✧', className: 'rarityGoldRare', label: 'GScR' },
  'Premium Gold Rare': { icon: '✧', className: 'rarityGoldRare', label: 'PGR' },

  // Starlight/Collector's Rare
  'Starlight Rare': { icon: '✨', className: 'rarityStarlightRare', label: 'StR' },
  'Collector\'s Rare': { icon: '✨', className: 'rarityCollectorRare', label: 'CR' },
  'Quarter Century Secret Rare': { icon: '✨', className: 'rarityStarlightRare', label: 'QCScR' },

  // Mosaic/Shatterfoil
  'Mosaic Rare': { icon: '▣', className: 'rarityMosaicRare', label: 'MR' },
  'Shatterfoil Rare': { icon: '▣', className: 'rarityMosaicRare', label: 'SHR' },
  'Starfoil Rare': { icon: '▣', className: 'rarityMosaicRare', label: 'SFR' },

  // Parallel Rare
  'Parallel Rare': { icon: '∥', className: 'rarityParallelRare', label: 'PR' },
  'Duel Terminal Normal Parallel Rare': { icon: '∥', className: 'rarityParallelRare', label: 'DTNPR' },
  'Duel Terminal Rare Parallel Rare': { icon: '∥', className: 'rarityParallelRare', label: 'DTRPR' },
  'Duel Terminal Super Parallel Rare': { icon: '∥', className: 'rarityParallelRare', label: 'DTSPR' },
  'Duel Terminal Ultra Parallel Rare': { icon: '∥', className: 'rarityParallelRare', label: 'DTUPR' },
  'Duel Terminal Secret Parallel Rare': { icon: '∥', className: 'rarityParallelRare', label: 'DTScPR' },
};

// Get rarity configuration with fallback
function getRarityConfig(rarity: string): { icon: string; className: string; label: string } {
  // Try exact match first
  if (RARITY_CONFIG[rarity]) {
    return RARITY_CONFIG[rarity];
  }

  // Try partial match for variations
  const rarityLower = rarity.toLowerCase();

  if (rarityLower.includes('starlight')) return RARITY_CONFIG['Starlight Rare'];
  if (rarityLower.includes('collector')) return RARITY_CONFIG['Collector\'s Rare'];
  if (rarityLower.includes('ghost')) return RARITY_CONFIG['Ghost Rare'];
  if (rarityLower.includes('ultimate')) return RARITY_CONFIG['Ultimate Rare'];
  if (rarityLower.includes('secret')) return RARITY_CONFIG['Secret Rare'];
  if (rarityLower.includes('ultra')) return RARITY_CONFIG['Ultra Rare'];
  if (rarityLower.includes('super')) return RARITY_CONFIG['Super Rare'];
  if (rarityLower.includes('gold')) return RARITY_CONFIG['Gold Rare'];
  if (rarityLower.includes('parallel')) return RARITY_CONFIG['Parallel Rare'];
  if (rarityLower.includes('mosaic') || rarityLower.includes('shatter') || rarityLower.includes('starfoil')) {
    return RARITY_CONFIG['Mosaic Rare'];
  }
  if (rarityLower.includes('rare') && !rarityLower.includes('common')) return RARITY_CONFIG['Rare'];

  // Default to common
  return RARITY_CONFIG['Common'];
}

interface CardDisplayProps {
  card: YugiohCard;
  compact?: boolean;
}

// Component to display all sets in a collapsible dropdown
function AllSetsDropdown({
  sets,
  cardId,
  cardName,
  imageUrl,
  isAuthenticated,
  onAddToList
}: {
  sets: CardSet[];
  cardId: number;
  cardName: string;
  imageUrl: string;
  isAuthenticated: boolean;
  onAddToList: (type: ListType, setCode: string, setName: string, setRarity: string, setPrice: string) => void;
}) {
  const { t } = useYugiohLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.allSetsSection}>
      <button
        type="button"
        className={styles.allSetsToggle}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className={styles.allSetsLabel}>
          📦 {t('card.setInfo')} ({sets.length})
        </span>
        <span className={styles.toggleIcon}>{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className={styles.setsList}>
          {sets.map((set, index) => {
            const rarityConfig = getRarityConfig(set.set_rarity);
            return (
            <div key={index} className={styles.setItem}>
              <div className={styles.setItemContent}>
                <div className={styles.setCode}>{set.set_code}</div>
                <div className={styles.setDetails}>
                  <div className={styles.setName}>{set.set_name}</div>
                  <div className={styles.setMeta}>
                    <span className={`${styles.setRarityBadge} ${styles[rarityConfig.className]}`}>
                      <span className={styles.rarityIcon}>{rarityConfig.icon}</span>
                      {set.set_rarity}
                    </span>
                    <span className={styles.setPrice}>
                      {formatPrice(parseFloat(set.set_price))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add to list buttons - only show when authenticated */}
              {isAuthenticated && (
                <div className={styles.setActions}>
                  <button
                    type="button"
                    className={styles.setActionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToList('collection', set.set_code, set.set_name, set.set_rarity, set.set_price);
                    }}
                    title={t('card.addToCollection')}
                  >
                    📚
                  </button>
                  <button
                    type="button"
                    className={styles.setActionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToList('for-sale', set.set_code, set.set_name, set.set_rarity, set.set_price);
                    }}
                    title={t('card.addToForSale')}
                  >
                    💰
                  </button>
                  <button
                    type="button"
                    className={styles.setActionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToList('wishlist', set.set_code, set.set_name, set.set_rarity, set.set_price);
                    }}
                    title={t('card.addToWishlist')}
                  >
                    ⭐
                  </button>
                </div>
              )}
            </div>
          );
          })}
        </div>
      )}
    </div>
  );
}

function CardDisplay({ card, compact = false }: CardDisplayProps) {
  const { t } = useYugiohLanguage();
  const { isAuthenticated } = useYugiohAuth();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const price = getCardPrice(card);
  const imageUrl = card.card_images[0]?.image_url_small || card.card_images[0]?.image_url;

  // Check if description is long (more than 250 characters)
  const isLongDescription = card.desc && card.desc.length > 250;

  const addToList = async (
    type: ListType,
    setCode: string,
    setName: string,
    setRarity: string,
    setPrice: string
  ) => {
    setIsAdding(true);

    try {
      // First, download and store the image locally
      let localImagePath = undefined;
      try {
        const downloadResponse = await fetch('/api/yugioh/download-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: imageUrl,
            cardId: card.id,
          }),
        });

        if (downloadResponse.ok) {
          const downloadData = await downloadResponse.json();
          localImagePath = downloadData.localPath;
        }
      } catch (downloadError) {
        console.warn('Failed to download image locally, will use remote URL:', downloadError);
      }

      // Add card to list with set code information
      const response = await fetch(`/api/yugioh/lists/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: card.id,
          cardName: card.name,
          cardImage: imageUrl,
          localImagePath: localImagePath,
          setCode: setCode,
          setName: setName,
          setRarity: setRarity,
          quantity: 1,
          price: parseFloat(setPrice),
        }),
      });

      if (response.ok) {
        // Special message when adding to for-sale (also adds to collection)
        let toastMessage;
        if (type === 'for-sale') {
          toastMessage = (
            <>
              ✓ <span style={{ color: '#22C55E', fontWeight: 700 }}>{card.name}</span>
              {' '}(<span style={{ color: '#FFD700', fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{setCode}</span>)
              {' '}{t('toast.added.forSale')}
            </>
          );
        } else if (type === 'collection') {
          toastMessage = (
            <>
              ✓ <span style={{ color: '#22C55E', fontWeight: 700 }}>{card.name}</span>
              {' '}(<span style={{ color: '#FFD700', fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{setCode}</span>)
              {' '}{t('toast.added.collection')}
            </>
          );
        } else {
          toastMessage = (
            <>
              ✓ <span style={{ color: '#22C55E', fontWeight: 700 }}>{card.name}</span>
              {' '}(<span style={{ color: '#FFD700', fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{setCode}</span>)
              {' '}{t('toast.added.wishlist')}
            </>
          );
        }

        showToast(toastMessage, 'success');
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

  if (compact) {
    return (
      <div className={styles.cardCompact}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={card.name}
            width={80}
            height={117}
            className={styles.compactImage}
          />
        )}
        <div className={styles.compactContent}>
          <div className={styles.compactInfo}>
            <h3 className={styles.compactTitle}>{card.name}</h3>
            <div className={styles.badges}>
              <span className={`${styles.badgeType} ${styles[getTypeClassName(card.type)]}`}>
                {card.type}
              </span>
              {card.attribute && (
                <span className={`${styles.badgeAttribute} ${styles[card.attribute.toLowerCase()]}`}>
                  {card.attribute}
                </span>
              )}
            </div>
          </div>
          <div className={styles.price}>{formatPrice(price)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      {/* Image with zoom hover */}
      <div className={styles.imageWrapper}>
        {imageUrl && (
          <div className={styles.imageContainer}>
            <Image
              src={imageUrl}
              alt={card.name}
              width={100}
              height={146}
              className={styles.cardImage}
              unoptimized
            />
            <div className={styles.imageZoomOverlay}>
              <Image
                src={imageUrl}
                alt={card.name}
                width={300}
                height={439}
                className={styles.largeImage}
                unoptimized
              />
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className={styles.cardContent}>
        <div className={styles.header}>
          <h2 className={styles.cardTitle}>{card.name}</h2>
          <div className={styles.badges}>
            <span className={`${styles.badgeType} ${styles[getTypeClassName(card.type)]}`}>
              {card.type}
            </span>
            {card.race && <span className={styles.badge}>{card.race}</span>}
            {card.attribute && (
              <span className={`${styles.badgeAttribute} ${styles[card.attribute.toLowerCase()]}`}>
                {card.attribute}
              </span>
            )}
            {card.archetype && <span className={styles.badgeBrand}>{card.archetype}</span>}
          </div>
        </div>

        {/* Stats for Monster Cards */}
        {(card.atk !== undefined || card.def !== undefined) && (
          <div className={styles.stats}>
            {card.level !== undefined && (
              <div className={styles.stat}>
                <strong>{t('card.level')}:</strong> {card.level}
              </div>
            )}
            {card.atk !== undefined && (
              <div className={styles.stat}>
                <strong>{t('card.atk')}:</strong> {card.atk}
              </div>
            )}
            {card.def !== undefined && (
              <div className={styles.stat}>
                <strong>{t('card.def')}:</strong> {card.def}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <div className={styles.description}>
          <p className={styles.descLabel}>{t('card.description')}:</p>
          <p className={styles.descText}>
            {isLongDescription && !isDescExpanded
              ? `${card.desc.substring(0, 250)}...`
              : card.desc}
          </p>
          {isLongDescription && (
            <button
              type="button"
              className={styles.expandButton}
              onClick={() => setIsDescExpanded(!isDescExpanded)}
            >
              {isDescExpanded ? `▲ ${t('card.showLess')}` : `▼ ${t('card.showMore')}`}
            </button>
          )}
        </div>

        {/* Card Codes - Different display based on search type */}
        {card.specificSetInfo ? (
          // Specific set code search - show only this set's info
          <div className={styles.codesSection}>
            <div className={styles.codeItem}>
              <strong>Passcode:</strong> <span className={styles.codeValue}>{card.id}</span>
            </div>
            <div className={styles.codeItem}>
              <strong>{t('card.setCode')}:</strong>{' '}
              <span className={styles.codeValue}>{card.specificSetInfo.setCode}</span>
            </div>
            <div className={styles.codeItem}>
              <strong>{t('card.setName')}:</strong>{' '}
              <span className={styles.setName}>{card.specificSetInfo.setName}</span>
            </div>
            <div className={styles.codeItem}>
              <strong>{t('card.rarity')}:</strong>{' '}
              {(() => {
                const rarityConfig = getRarityConfig(card.specificSetInfo.setRarity);
                return (
                  <span className={`${styles.rarityBadge} ${styles[rarityConfig.className]}`}>
                    <span className={styles.rarityIcon}>{rarityConfig.icon}</span>
                    {card.specificSetInfo.setRarity}
                  </span>
                );
              })()}
            </div>
          </div>
        ) : (
          // Name search - show passcode only, sets will be in collapsible section
          <div className={styles.codesSection}>
            <div className={styles.codeItem}>
              <strong>Passcode:</strong> <span className={styles.codeValue}>{card.id}</span>
            </div>
          </div>
        )}

        {/* All Sets - Collapsible (only for name search) */}
        {!card.specificSetInfo && card.card_sets && card.card_sets.length > 0 && (
          <AllSetsDropdown
            sets={card.card_sets}
            cardId={card.id}
            cardName={card.name}
            imageUrl={imageUrl}
            isAuthenticated={isAuthenticated}
            onAddToList={addToList}
          />
        )}

        {/* Price */}
        <div className={styles.priceSection}>
          {card.specificSetInfo ? (
            // Set code search - show set price with fallback to general price
            <>
              {parseFloat(card.specificSetInfo.setPrice) > 0 ? (
                // Set has a price
                <>
                  <span className={styles.priceLabel}>{t('card.price.set')}:</span>
                  <span className={styles.priceValue}>
                    {formatPrice(parseFloat(card.specificSetInfo.setPrice))}
                  </span>
                </>
              ) : (
                // Set price is $0 - show general price instead
                <div className={styles.priceWithFallback}>
                  <div className={styles.priceRow}>
                    <span className={styles.priceLabel}>{t('card.price.set')}:</span>
                    <span className={styles.priceUnavailable}>{t('card.price.unavailable')}</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span className={styles.priceLabel}>{t('card.price.general')}:</span>
                    <span className={styles.priceValue}>{formatPrice(price)}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            // Name search - show general price
            <>
              <span className={styles.priceLabel}>{t('card.price.general')}:</span>
              <span className={styles.priceValue}>{formatPrice(price)}</span>
            </>
          )}
        </div>

        {/* Add to List Buttons - only show for set code searches */}
        {isAuthenticated && card.specificSetInfo && (
          <div className={styles.actions}>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.addButton}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToList(
                    'collection',
                    card.specificSetInfo!.setCode,
                    card.specificSetInfo!.setName,
                    card.specificSetInfo!.setRarity,
                    card.specificSetInfo!.setPrice
                  );
                }}
                disabled={isAdding}
              >
                {isAdding ? '...' : `+ ${t('header.collection')}`}
              </button>
              <button
                type="button"
                className={styles.addButton}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToList(
                    'for-sale',
                    card.specificSetInfo!.setCode,
                    card.specificSetInfo!.setName,
                    card.specificSetInfo!.setRarity,
                    card.specificSetInfo!.setPrice
                  );
                }}
                disabled={isAdding}
              >
                {isAdding ? '...' : `+ ${t('header.forSale')}`}
              </button>
              <button
                type="button"
                className={styles.addButton}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToList(
                    'wishlist',
                    card.specificSetInfo!.setCode,
                    card.specificSetInfo!.setName,
                    card.specificSetInfo!.setRarity,
                    card.specificSetInfo!.setPrice
                  );
                }}
                disabled={isAdding}
              >
                {isAdding ? '...' : `+ ${t('header.wishlist')}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(CardDisplay, (prevProps, nextProps) => {
  return prevProps.card.id === nextProps.card.id &&
         prevProps.compact === nextProps.compact;
});
