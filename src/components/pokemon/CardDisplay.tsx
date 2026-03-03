'use client';

import { useState, memo } from 'react';
import { usePokemonLanguage } from '@/contexts/PokemonLanguageContext';
import { PokemonCard, ListType } from '@/types/pokemon';
import { getCardPrice, formatPrice } from '@/lib/services/pokemontcg';
import { usePokemonAuth } from '@/contexts/PokemonAuthContext';
import { useToast } from '@/contexts/ToastContext';
import Image from 'next/image';
import styles from './CardDisplay.module.scss';

// Pokemon type color mapping
const TYPE_COLORS: Record<string, { bg: string; border: string; color: string }> = {
  Colorless: { bg: 'rgba(168, 162, 158, 0.3)', border: 'rgba(168, 162, 158, 0.6)', color: '#A8A29E' },
  Darkness: { bg: 'rgba(68, 64, 60, 0.4)', border: 'rgba(68, 64, 60, 0.7)', color: '#D6D3D1' },
  Dragon: { bg: 'rgba(255, 215, 0, 0.3)', border: 'rgba(255, 215, 0, 0.6)', color: '#FFD700' },
  Fairy: { bg: 'rgba(236, 72, 153, 0.3)', border: 'rgba(236, 72, 153, 0.6)', color: '#EC4899' },
  Fighting: { bg: 'rgba(194, 65, 12, 0.3)', border: 'rgba(194, 65, 12, 0.6)', color: '#EA580C' },
  Fire: { bg: 'rgba(239, 68, 68, 0.3)', border: 'rgba(239, 68, 68, 0.6)', color: '#F87171' },
  Grass: { bg: 'rgba(34, 197, 94, 0.3)', border: 'rgba(34, 197, 94, 0.6)', color: '#22C55E' },
  Lightning: { bg: 'rgba(250, 204, 21, 0.3)', border: 'rgba(250, 204, 21, 0.6)', color: '#FACC15' },
  Metal: { bg: 'rgba(148, 163, 184, 0.3)', border: 'rgba(148, 163, 184, 0.6)', color: '#94A3B8' },
  Psychic: { bg: 'rgba(168, 85, 247, 0.3)', border: 'rgba(168, 85, 247, 0.6)', color: '#A855F7' },
  Water: { bg: 'rgba(59, 130, 246, 0.3)', border: 'rgba(59, 130, 246, 0.6)', color: '#3B82F6' },
};

function getTypeStyle(type: string): React.CSSProperties {
  const colors = TYPE_COLORS[type];
  if (!colors) {
    return {
      background: 'rgba(100, 100, 100, 0.3)',
      borderColor: 'rgba(100, 100, 100, 0.6)',
      color: 'rgba(255, 255, 255, 0.8)',
    };
  }
  return {
    background: colors.bg,
    borderColor: colors.border,
    color: colors.color,
  };
}

// Energy type emoji/icon mapping for attack costs
const ENERGY_ICONS: Record<string, string> = {
  Colorless: '~',
  Darkness: '!',
  Dragon: '#',
  Fairy: '$',
  Fighting: '%',
  Fire: '^',
  Grass: '&',
  Lightning: '*',
  Metal: '(',
  Psychic: ')',
  Water: '+',
  Free: '-',
};

// Get energy display character (fallback to first letter)
function getEnergyDisplay(type: string): string {
  return type.charAt(0);
}

// Rarity configuration with icons and colors
const RARITY_CONFIG: Record<string, { icon: string; className: string; label: string }> = {
  // Common rarities
  'Common': { icon: '●', className: 'rarityCommon', label: 'C' },

  // Uncommon
  'Uncommon': { icon: '◆', className: 'rarityUncommon', label: 'U' },

  // Rare
  'Rare': { icon: '★', className: 'rarityRare', label: 'R' },

  // Rare Holo
  'Rare Holo': { icon: '★', className: 'rarityRareHolo', label: 'RH' },

  // Rare Holo EX/GX/V
  'Rare Holo EX': { icon: '✦', className: 'rarityRareHoloEX', label: 'EX' },
  'Rare Holo GX': { icon: '✦', className: 'rarityRareHoloEX', label: 'GX' },
  'Rare Holo V': { icon: '✦', className: 'rarityRareHoloV', label: 'V' },
  'Rare Holo VMAX': { icon: '✦', className: 'rarityRareHoloVMAX', label: 'VMAX' },
  'Rare Holo VSTAR': { icon: '✦', className: 'rarityRareHoloVSTAR', label: 'VSTAR' },

  // Ultra Rare
  'Rare Ultra': { icon: '◈', className: 'rarityUltraRare', label: 'UR' },

  // Secret Rare
  'Rare Secret': { icon: '✨', className: 'raritySecretRare', label: 'SR' },

  // Rainbow Rare
  'Rare Rainbow': { icon: '🌈', className: 'rarityRainbowRare', label: 'RR' },

  // Rare Shiny
  'Rare Shiny': { icon: '✧', className: 'rarityShiny', label: 'SH' },
  'Rare Shiny GX': { icon: '✧', className: 'rarityShinyGX', label: 'SHG' },

  // Amazing Rare
  'Amazing Rare': { icon: '◈', className: 'rarityAmazingRare', label: 'AR' },

  // Illustration Rare (Scarlet & Violet era)
  'Illustration Rare': { icon: '🎨', className: 'rarityIllustrationRare', label: 'IR' },
  'Special Illustration Rare': { icon: '🎨', className: 'raritySpecialIllustrationRare', label: 'SIR' },
  'Hyper Rare': { icon: '💎', className: 'rarityHyperRare', label: 'HR' },
  'Double Rare': { icon: '★★', className: 'rarityDoubleRare', label: 'RR' },

  // Promo
  'Promo': { icon: '🏷️', className: 'rarityPromo', label: 'PR' },

  // ACE SPEC
  'ACE SPEC Rare': { icon: '♠', className: 'rarityACESpec', label: 'ACE' },

  // Classic Collection
  'Classic Collection': { icon: '📜', className: 'rarityClassic', label: 'CC' },

  // Radiant
  'Radiant Rare': { icon: '☀️', className: 'rarityRadiant', label: 'RD' },

  // Trainer Gallery
  'Rare Holo Star': { icon: '⭐', className: 'rarityHoloStar', label: 'HS' },

  // LEGEND
  'LEGEND': { icon: '🏆', className: 'rarityLegend', label: 'LG' },

  // Rare BREAK
  'Rare BREAK': { icon: '💥', className: 'rarityBreak', label: 'BK' },

  // Rare Prime
  'Rare Prime': { icon: '⚡', className: 'rarityPrime', label: 'PM' },
};

// Get rarity configuration with fallback
function getRarityConfig(rarity: string): { icon: string; className: string; label: string } {
  // Try exact match first
  if (RARITY_CONFIG[rarity]) {
    return RARITY_CONFIG[rarity];
  }

  // Try partial match for variations
  const rarityLower = rarity.toLowerCase();

  if (rarityLower.includes('special illustration')) return RARITY_CONFIG['Special Illustration Rare'];
  if (rarityLower.includes('illustration')) return RARITY_CONFIG['Illustration Rare'];
  if (rarityLower.includes('hyper')) return RARITY_CONFIG['Hyper Rare'];
  if (rarityLower.includes('rainbow')) return RARITY_CONFIG['Rare Rainbow'];
  if (rarityLower.includes('secret')) return RARITY_CONFIG['Rare Secret'];
  if (rarityLower.includes('ultra')) return RARITY_CONFIG['Rare Ultra'];
  if (rarityLower.includes('amazing')) return RARITY_CONFIG['Amazing Rare'];
  if (rarityLower.includes('radiant')) return RARITY_CONFIG['Radiant Rare'];
  if (rarityLower.includes('shiny') && rarityLower.includes('gx')) return RARITY_CONFIG['Rare Shiny GX'];
  if (rarityLower.includes('shiny')) return RARITY_CONFIG['Rare Shiny'];
  if (rarityLower.includes('vstar')) return RARITY_CONFIG['Rare Holo VSTAR'];
  if (rarityLower.includes('vmax')) return RARITY_CONFIG['Rare Holo VMAX'];
  if (rarityLower.includes('holo v')) return RARITY_CONFIG['Rare Holo V'];
  if (rarityLower.includes('holo ex')) return RARITY_CONFIG['Rare Holo EX'];
  if (rarityLower.includes('holo gx')) return RARITY_CONFIG['Rare Holo GX'];
  if (rarityLower.includes('holo star')) return RARITY_CONFIG['Rare Holo Star'];
  if (rarityLower.includes('holo')) return RARITY_CONFIG['Rare Holo'];
  if (rarityLower.includes('double')) return RARITY_CONFIG['Double Rare'];
  if (rarityLower.includes('ace spec')) return RARITY_CONFIG['ACE SPEC Rare'];
  if (rarityLower.includes('break')) return RARITY_CONFIG['Rare BREAK'];
  if (rarityLower.includes('prime')) return RARITY_CONFIG['Rare Prime'];
  if (rarityLower.includes('legend')) return RARITY_CONFIG['LEGEND'];
  if (rarityLower.includes('promo')) return RARITY_CONFIG['Promo'];
  if (rarityLower.includes('rare') && !rarityLower.includes('common')) return RARITY_CONFIG['Rare'];
  if (rarityLower.includes('uncommon')) return RARITY_CONFIG['Uncommon'];

  // Default to common
  return RARITY_CONFIG['Common'];
}

// Get the CSS class name for supertype
function getSupertypeClassName(supertype: string): string {
  return supertype
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .replace(/^./, (str) => str.toLowerCase());
}

interface CardDisplayProps {
  card: PokemonCard;
  compact?: boolean;
}

function CardDisplay({ card, compact = false }: CardDisplayProps) {
  const { t } = usePokemonLanguage();
  const { isAuthenticated } = usePokemonAuth();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isRulesExpanded, setIsRulesExpanded] = useState(false);
  const [isAttacksExpanded, setIsAttacksExpanded] = useState(false);

  const price = getCardPrice(card);
  const imageUrl = card.images.small;
  const largeImageUrl = card.images.large;

  const addToList = async (type: ListType) => {
    setIsAdding(true);

    try {
      // First, download and store the image locally
      let localImagePath = undefined;
      try {
        const downloadResponse = await fetch('/api/pokemon/download-image', {
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

      // Add card to list
      const response = await fetch(`/api/pokemon/lists/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: card.id,
          cardName: card.name,
          cardImage: imageUrl,
          localImagePath: localImagePath,
          setCode: card.set.id,
          setName: card.set.name,
          setRarity: card.rarity || 'Unknown',
          quantity: 1,
          price: price,
        }),
      });

      if (response.ok) {
        let toastMessage;
        if (type === 'for-sale') {
          toastMessage = (
            <>
              {'+ '}<span style={{ color: '#22C55E', fontWeight: 700 }}>{card.name}</span>
              {' '}(<span style={{ color: '#EF4444', fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{card.id}</span>)
              {' '}{t('toast.added.forSale')}
            </>
          );
        } else if (type === 'collection') {
          toastMessage = (
            <>
              {'+ '}<span style={{ color: '#22C55E', fontWeight: 700 }}>{card.name}</span>
              {' '}(<span style={{ color: '#EF4444', fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{card.id}</span>)
              {' '}{t('toast.added.collection')}
            </>
          );
        } else {
          toastMessage = (
            <>
              {'+ '}<span style={{ color: '#22C55E', fontWeight: 700 }}>{card.name}</span>
              {' '}(<span style={{ color: '#EF4444', fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{card.id}</span>)
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

  // Check if card has rules text (V, VMAX, EX, etc.)
  const hasRules = card.rules && card.rules.length > 0;
  const hasAbilities = card.abilities && card.abilities.length > 0;
  const hasAttacks = card.attacks && card.attacks.length > 0;
  const hasWeaknesses = card.weaknesses && card.weaknesses.length > 0;
  const hasResistances = card.resistances && card.resistances.length > 0;
  const hasRetreatCost = card.retreat && card.retreat > 0;

  if (compact) {
    return (
      <div className={styles.cardCompact}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={card.name}
            width={80}
            height={112}
            className={styles.compactImage}
            unoptimized
          />
        )}
        <div className={styles.compactContent}>
          <div className={styles.compactInfo}>
            <h3 className={styles.compactTitle}>{card.name}</h3>
            <div className={styles.badges}>
              <span className={`${styles.badgeSupertype} ${styles[getSupertypeClassName(card.supertype)]}`}>
                {card.supertype}
              </span>
              {card.types && card.types.map((type) => (
                <span
                  key={type}
                  className={styles.badgeType}
                  style={getTypeStyle(type)}
                >
                  {type}
                </span>
              ))}
              {card.hp && (
                <span className={styles.badgeHP}>
                  {card.hp} HP
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
      {/* Card thumbnail */}
      <div className={styles.imageWrapper}>
        {imageUrl && (
          <div className={styles.imageContainer}>
            <Image
              src={imageUrl}
              alt={card.name}
              width={100}
              height={140}
              className={styles.cardImage}
              unoptimized
            />
          </div>
        )}
        {/* Hover preview */}
        {largeImageUrl && (
          <div className={styles.imageZoomOverlay}>
            <Image
              src={largeImageUrl}
              alt={card.name}
              width={300}
              height={419}
              className={styles.largeImage}
              unoptimized
            />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className={styles.cardContent}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <h2 className={styles.cardTitle}>{card.name}</h2>
            {card.hp && (
              <span className={styles.hpBadge}>
                {card.hp} HP
              </span>
            )}
          </div>
          <div className={styles.badges}>
            <span className={`${styles.badgeSupertype} ${styles[getSupertypeClassName(card.supertype)]}`}>
              {card.supertype}
            </span>
            {card.subtypes && card.subtypes.map((subtype) => (
              <span key={subtype} className={styles.badgeSubtype}>
                {subtype}
              </span>
            ))}
            {card.types && card.types.map((type) => (
              <span
                key={type}
                className={styles.badgeType}
                style={getTypeStyle(type)}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Evolution info */}
        {card.evolveFrom && (
          <div className={styles.evolutionInfo}>
            <span className={styles.evolvesLabel}>Evolves from</span>
            <span className={styles.evolvesValue}>{card.evolveFrom}</span>
          </div>
        )}

        {/* Abilities */}
        {hasAbilities && (
          <div className={styles.abilitiesSection}>
            <p className={styles.sectionLabel}>{t('card.abilities')}:</p>
            {card.abilities!.map((ability, index) => (
              <div key={index} className={styles.abilityItem}>
                <div className={styles.abilityHeader}>
                  <span className={styles.abilityType}>{ability.type}</span>
                  <span className={styles.abilityName}>{ability.name}</span>
                </div>
                <p className={styles.abilityText}>{ability.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Attacks */}
        {hasAttacks && (
          <div className={styles.attacksSection}>
            <div className={styles.attacksHeader}>
              <p className={styles.sectionLabel}>{t('card.attacks')}:</p>
              {card.attacks!.length > 2 && (
                <button
                  type="button"
                  className={styles.expandButton}
                  onClick={() => setIsAttacksExpanded(!isAttacksExpanded)}
                >
                  {isAttacksExpanded ? `${t('card.showLess')}` : `${t('card.showMore')} (${card.attacks!.length})`}
                </button>
              )}
            </div>
            {(isAttacksExpanded ? card.attacks! : card.attacks!.slice(0, 2)).map((attack, index) => (
              <div key={index} className={styles.attackItem}>
                <div className={styles.attackHeader}>
                  <div className={styles.attackCost}>
                    {attack.cost && attack.cost.map((energy, eIndex) => (
                      <span
                        key={eIndex}
                        className={styles.energyIcon}
                        style={getTypeStyle(energy)}
                        title={energy}
                      >
                        {getEnergyDisplay(energy)}
                      </span>
                    ))}
                  </div>
                  <span className={styles.attackName}>{attack.name}</span>
                  {attack.damage && (
                    <span className={styles.attackDamage}>{attack.damage}</span>
                  )}
                </div>
                {attack.text && (
                  <p className={styles.attackText}>{attack.text}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Weaknesses, Resistances, Retreat Cost */}
        {(hasWeaknesses || hasResistances || hasRetreatCost) && (
          <div className={styles.combatInfo}>
            {hasWeaknesses && (
              <div className={styles.combatRow}>
                <span className={styles.combatLabel}>{t('card.weaknesses')}:</span>
                <div className={styles.combatValues}>
                  {card.weaknesses!.map((weakness, index) => (
                    <span
                      key={index}
                      className={styles.combatBadge}
                      style={getTypeStyle(weakness.type)}
                    >
                      {weakness.type} {weakness.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {hasResistances && (
              <div className={styles.combatRow}>
                <span className={styles.combatLabel}>{t('card.resistances')}:</span>
                <div className={styles.combatValues}>
                  {card.resistances!.map((resistance, index) => (
                    <span
                      key={index}
                      className={styles.combatBadge}
                      style={getTypeStyle(resistance.type)}
                    >
                      {resistance.type} {resistance.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {hasRetreatCost && (
              <div className={styles.combatRow}>
                <span className={styles.combatLabel}>{t('card.retreatCost')}:</span>
                <div className={styles.combatValues}>
                  {Array.from({ length: card.retreat! }, (_, index) => (
                    <span
                      key={index}
                      className={styles.energyIcon}
                      style={getTypeStyle('Colorless')}
                      title="Colorless"
                    >
                      {getEnergyDisplay('Colorless')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rules text (V, VMAX, EX, etc.) */}
        {hasRules && (
          <div className={styles.rulesSection}>
            <p className={styles.sectionLabel}>{t('card.rules')}:</p>
            {(isRulesExpanded ? card.rules! : card.rules!.slice(0, 1)).map((rule, index) => (
              <p key={index} className={styles.ruleText}>{rule}</p>
            ))}
            {card.rules!.length > 1 && (
              <button
                type="button"
                className={styles.expandButton}
                onClick={() => setIsRulesExpanded(!isRulesExpanded)}
              >
                {isRulesExpanded ? `${t('card.showLess')}` : `${t('card.showMore')} (${card.rules!.length})`}
              </button>
            )}
          </div>
        )}

        {/* Flavor text */}
        {card.flavorText && (
          <div className={styles.flavorSection}>
            <p className={styles.flavorText}>{card.flavorText}</p>
          </div>
        )}

        {/* Set Info */}
        <div className={styles.codesSection}>
          <div className={styles.codeItem}>
            <strong>{t('card.setCode')}:</strong>{' '}
            <span className={styles.codeValue}>{card.id}</span>
          </div>
          <div className={styles.codeItem}>
            <strong>{t('card.setName')}:</strong>{' '}
            <span className={styles.setName}>{card.set.name}</span>
          </div>
          <div className={styles.codeItem}>
            <strong>{t('card.number')}:</strong>{' '}
            <span className={styles.codeValue}>{card.number}/{card.set.printedTotal}</span>
          </div>
          {card.rarity && (
            <div className={styles.codeItem}>
              <strong>{t('card.rarity')}:</strong>{' '}
              {(() => {
                const rarityConfig = getRarityConfig(card.rarity);
                return (
                  <span className={`${styles.rarityBadge} ${styles[rarityConfig.className]}`}>
                    <span className={styles.rarityIcon}>{rarityConfig.icon}</span>
                    {card.rarity}
                  </span>
                );
              })()}
            </div>
          )}
          {card.artist && (
            <div className={styles.codeItem}>
              <strong>{t('card.artist')}:</strong>{' '}
              <span className={styles.artistValue}>{card.artist}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className={styles.priceSection}>
          <span className={styles.priceLabel}>{t('card.price.market')}:</span>
          {price > 0 ? (
            <span className={styles.priceValue}>{formatPrice(price)}</span>
          ) : (
            <span className={styles.priceUnavailable}>{t('card.price.unavailable')}</span>
          )}
        </div>

        {/* Add to List Buttons */}
        {isAuthenticated && (
          <div className={styles.actions}>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.addButton}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToList('collection');
                }}
                disabled={isAdding}
              >
                {isAdding ? '...' : `+ \u{1F4DA} ${t('header.collection')}`}
              </button>
              <button
                type="button"
                className={styles.addButton}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToList('for-sale');
                }}
                disabled={isAdding}
              >
                {isAdding ? '...' : `+ \u{1F4B0} ${t('header.forSale')}`}
              </button>
              <button
                type="button"
                className={styles.addButton}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToList('wishlist');
                }}
                disabled={isAdding}
              >
                {isAdding ? '...' : `+ \u{2B50} ${t('header.wishlist')}`}
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
