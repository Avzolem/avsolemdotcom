'use client';

import { useState, useEffect, useMemo } from 'react';
import { CardInList, ListType } from '@/types/pokemon';
import { formatPrice, getCardById, getCardPrice } from '@/lib/services/pokemontcg';
import { usePokemonAuth } from '@/contexts/PokemonAuthContext';
import { usePokemonLanguage } from '@/contexts/PokemonLanguageContext';
import { useToast } from '@/contexts/ToastContext';
import ExportButtons from './ExportButtons';
import PriceStats from './PriceStats';
import ShareButton from './ShareButton';
import Image from 'next/image';
import styles from './CardList.module.scss';

// Rarity configuration with icons and colors
const RARITY_CONFIG: Record<string, { icon: string; className: string }> = {
  'Common': { icon: '●', className: 'rarityCommon' },
  'Uncommon': { icon: '◆', className: 'rarityUncommon' },
  'Rare': { icon: '★', className: 'rarityRare' },
  'Rare Holo': { icon: '★', className: 'rarityRareHolo' },
  'Rare Holo EX': { icon: '✦', className: 'rarityRareHoloEX' },
  'Rare Holo GX': { icon: '✦', className: 'rarityRareHoloEX' },
  'Rare Holo V': { icon: '✦', className: 'rarityRareHoloV' },
  'Rare Holo VMAX': { icon: '✦', className: 'rarityRareHoloVMAX' },
  'Rare Holo VSTAR': { icon: '✦', className: 'rarityRareHoloVSTAR' },
  'Rare Ultra': { icon: '◈', className: 'rarityUltraRare' },
  'Rare Secret': { icon: '✨', className: 'raritySecretRare' },
  'Rare Rainbow': { icon: '🌈', className: 'rarityRainbowRare' },
  'Rare Shiny': { icon: '✧', className: 'rarityShiny' },
  'Rare Shiny GX': { icon: '✧', className: 'rarityShinyGX' },
  'Amazing Rare': { icon: '◈', className: 'rarityAmazingRare' },
  'Illustration Rare': { icon: '🎨', className: 'rarityIllustrationRare' },
  'Special Illustration Rare': { icon: '🎨', className: 'raritySpecialIllustrationRare' },
  'Hyper Rare': { icon: '💎', className: 'rarityHyperRare' },
  'Double Rare': { icon: '★★', className: 'rarityDoubleRare' },
  'Promo': { icon: '🏷️', className: 'rarityPromo' },
  'ACE SPEC Rare': { icon: '♠', className: 'rarityACESpec' },
  'Radiant Rare': { icon: '☀️', className: 'rarityRadiant' },
  'Rare Holo Star': { icon: '⭐', className: 'rarityHoloStar' },
  'LEGEND': { icon: '🏆', className: 'rarityLegend' },
  'Rare BREAK': { icon: '💥', className: 'rarityBreak' },
  'Rare Prime': { icon: '⚡', className: 'rarityPrime' },
};

function getRarityConfig(rarity: string): { icon: string; className: string } {
  if (RARITY_CONFIG[rarity]) return RARITY_CONFIG[rarity];

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

  return RARITY_CONFIG['Common'];
}

interface CardListProps {
  type: ListType;
  title?: string;
}

export default function CardList({ type, title }: CardListProps) {
  const { isAuthenticated } = usePokemonAuth();
  const { t } = usePokemonLanguage();
  const { showToast } = useToast();

  // Get title from translations based on type
  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case 'collection':
        return t('list.collection.title');
      case 'for-sale':
        return t('list.forSale.title');
      case 'wishlist':
        return t('list.wishlist.title');
      default:
        return '';
    }
  };

  const displayTitle = getTitle();
  const [cards, setCards] = useState<CardInList[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [isTogglingForSale, setIsTogglingForSale] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [generalPrices, setGeneralPrices] = useState<Record<string, number>>({});

  const loadCards = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/pokemon/lists/${type}`);
      const data = await response.json();

      setCards(data.list?.cards || []);
      setTotalValue(data.totalValue || 0);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // Load general prices for cards with price = 0
  useEffect(() => {
    const fetchGeneralPrices = async () => {
      const cardsWithoutPrice = cards.filter(card => !card.price || card.price === 0);

      if (cardsWithoutPrice.length === 0) return;

      const prices: Record<string, number> = {};

      for (const card of cardsWithoutPrice) {
        try {
          const fullCard = await getCardById(card.cardId);
          if (fullCard) {
            prices[card.cardId] = getCardPrice(fullCard);
          }
        } catch (error) {
          console.error(`Error fetching price for card ${card.cardId}:`, error);
        }
      }

      setGeneralPrices(prices);
    };

    fetchGeneralPrices();
  }, [cards]);

  const removeCard = async (cardId: string, cardName: string) => {
    if (!confirm(t('list.confirmDelete'))) return;

    setIsRemoving(cardId);

    try {
      const response = await fetch(`/api/pokemon/lists/${type}?cardId=${encodeURIComponent(cardId)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        const deletedFrom = data.deletedFrom || [type];

        // Show toast based on what was deleted
        const listNames: Record<ListType, string> = {
          collection: t('header.collection'),
          'for-sale': t('header.forSale'),
          wishlist: t('header.wishlist'),
        };

        let message;
        if (deletedFrom.length > 1) {
          const lists = deletedFrom.map((listType: ListType) => listNames[listType]).join(' y ');
          message = (
            <>
              {'- '}<span style={{ color: '#22C55E', fontWeight: 700 }}>{cardName}</span>
              {' '}(<span style={{ color: '#EF4444', fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{cardId}</span>)
              {' '}{t('list.deletedFrom')} {lists}
            </>
          );
        } else {
          message = (
            <>
              {'- '}<span style={{ color: '#22C55E', fontWeight: 700 }}>{cardName}</span>
              {' '}(<span style={{ color: '#EF4444', fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{cardId}</span>)
              {' '}{t('list.deletedFrom')} {listNames[deletedFrom[0] as ListType]}
            </>
          );
        }

        showToast(message, 'info');
        await loadCards();
      } else {
        const errorText = await response.text();
        console.error('Failed to remove card:', errorText);
        showToast(t('list.errorDelete'), 'error');
      }
    } catch (error) {
      console.error('Error removing card:', error);
      showToast(t('list.errorDelete'), 'error');
    } finally {
      setIsRemoving(null);
    }
  };

  const updateQuantity = async (cardId: string, newQuantity: number) => {
    // Save previous state for rollback
    const previousCards = cards;
    const previousTotal = totalValue;

    // Optimistic UI update
    const updatedCards = cards.map(card =>
      card.cardId === cardId
        ? { ...card, quantity: newQuantity }
        : card
    );

    const newTotal = updatedCards.reduce(
      (sum, card) => sum + (card.price || 0) * card.quantity,
      0
    );

    setCards(updatedCards);
    setTotalValue(newTotal);

    try {
      const response = await fetch(`/api/pokemon/lists/${type}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, quantity: newQuantity }),
      });

      if (!response.ok) {
        console.error('Failed to update quantity:', await response.text());
        // Rollback on failure
        setCards(previousCards);
        setTotalValue(previousTotal);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Rollback on error
      setCards(previousCards);
      setTotalValue(previousTotal);
    }
  };

  const toggleForSale = async (cardId: string, currentForSale: boolean, cardName: string) => {
    setIsTogglingForSale(cardId);

    try {
      const response = await fetch('/api/pokemon/toggle-for-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId }),
      });

      if (response.ok) {
        const data = await response.json();
        const newIsForSale = data.isForSale;

        // Optimistic local state update
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.cardId === cardId ? { ...card, isForSale: newIsForSale } : card
          )
        );

        // Show toast
        if (newIsForSale) {
          showToast(
            <>
              {'+ '}<span style={{ color: '#22C55E', fontWeight: 700 }}>{cardName}</span>
              {' '}(<span style={{ color: '#EF4444', fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{cardId}</span>)
              {' '}{t('list.forSale.addedToast')}
            </>,
            'success'
          );
        } else {
          showToast(
            <>
              <span style={{ color: '#22C55E', fontWeight: 700 }}>{cardName}</span>
              {' '}(<span style={{ color: '#EF4444', fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{cardId}</span>)
              {' '}{t('list.forSale.removedToast')}
            </>,
            'info'
          );
        }
      } else {
        showToast(t('list.forSale.error'), 'error');
      }
    } catch (error) {
      console.error('Error toggling for-sale:', error);
      showToast(t('list.forSale.error'), 'error');
    } finally {
      setIsTogglingForSale(null);
    }
  };

  // Filter cards locally
  const filteredCards = useMemo(() => {
    if (!searchTerm) return cards;

    return cards.filter(card =>
      card.cardName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cards, searchTerm]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className="pokemon-skeleton" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
        <p>{t('list.loading')} {displayTitle.toLowerCase()}...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{displayTitle}</h1>
        <div className={styles.headerRow}>
          <span className={`${styles.badge} ${styles.brand}`}>
            {t('list.cardsCount', { count: cards.length })}
          </span>
          <span className={`${styles.badge} ${styles.accent}`}>
            {t('list.totalValue')}: {formatPrice(totalValue)}
          </span>
          <ExportButtons cards={cards} listName={displayTitle} totalValue={totalValue} />
          {isAuthenticated && <ShareButton listType={type} listName={displayTitle} />}
        </div>
      </div>

      {/* Price Statistics */}
      <PriceStats cards={filteredCards} />

      {/* Search Bar */}
      {cards.length > 0 && (
        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder={t('list.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className={styles.clearBtn}>
                x
              </button>
            )}
          </div>
          {filteredCards.length !== cards.length && (
            <p className={styles.filterInfo}>
              {t('list.showingResults', { shown: filteredCards.length, total: cards.length })}
            </p>
          )}
        </div>
      )}

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>{isAuthenticated ? '📦' : '🔐'}</div>
          <h2 className={styles.emptyTitle}>
            {isAuthenticated ? t('list.empty.title') : t('list.empty.notLoggedIn.title')}
          </h2>
          <p className={styles.emptyText}>
            {isAuthenticated ? t('list.empty.description') : t('list.empty.notLoggedIn.description')}
          </p>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔍</div>
          <h2 className={styles.emptyTitle}>{t('list.empty.noResults')}</h2>
          <p className={styles.emptyText}>{t('list.empty.noResultsDescription')}</p>
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {filteredCards.map((card) => (
            <div key={card.cardId} className={styles.cardItem}>
              {/* Card Image */}
              <div className={styles.cardImageWrapper}>
                <div className={styles.cardImage}>
                  <Image
                    src={card.localImagePath || card.cardImage}
                    alt={card.cardName}
                    width={100}
                    height={140}
                    unoptimized={!card.localImagePath}
                    className={styles.smallImage}
                  />
                  <div className={styles.imageZoomOverlay}>
                    <Image
                      src={card.localImagePath || card.cardImage}
                      alt={card.cardName}
                      width={300}
                      height={419}
                      unoptimized={!card.localImagePath}
                      className={styles.largeImage}
                    />
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className={styles.cardContent}>
                <h3 className={styles.cardName}>{card.cardName}</h3>

                <div className={styles.cardInfo}>
                  {/* Card ID and Set Information */}
                  <div className={styles.setInfoSection}>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>{t('list.cardId')}</span>
                      <span className={styles.cardIdValue}>{card.cardId}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>{t('list.set')}</span>
                      <span className={styles.infoValue}>{card.setName}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>{t('list.rarity')}</span>
                      {(() => {
                        const rarityConfig = getRarityConfig(card.setRarity);
                        return (
                          <span className={`${styles.rarityBadge} ${styles[rarityConfig.className]}`}>
                            <span className={styles.rarityIcon}>{rarityConfig.icon}</span>
                            {card.setRarity}
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>{t('list.quantity')}</span>
                    {isAuthenticated ? (
                      <div className={styles.quantityControls}>
                        <button
                          type="button"
                          className={styles.quantityBtn}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateQuantity(card.cardId, card.quantity - 1);
                          }}
                          disabled={card.quantity <= 1}
                        >
                          -
                        </button>
                        <span className={styles.quantityValue}>{card.quantity}</span>
                        <button
                          type="button"
                          className={styles.quantityBtn}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateQuantity(card.cardId, card.quantity + 1);
                          }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className={styles.infoValue}>{card.quantity}</span>
                    )}
                  </div>

                  {/* Price and For Sale Button */}
                  <div className={styles.priceRow}>
                    {card.price && card.price > 0 ? (
                      // Has price
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>{t('list.price')}</span>
                        <span className={`${styles.infoValue} ${styles.price}`}>
                          {formatPrice(card.price)}
                        </span>
                      </div>
                    ) : (
                      // Price is $0 - show general price fallback
                      <div className={styles.priceWithFallback}>
                        <div className={styles.priceRowFallback}>
                          <span className={styles.infoLabel}>{t('list.priceMarket')}</span>
                          <span className={styles.priceUnavailable}>{t('list.priceUnavailable')}</span>
                        </div>
                        {generalPrices[card.cardId] !== undefined && (
                          <div className={styles.priceRowFallback}>
                            <span className={styles.infoLabel}>{t('list.priceEstimated')}</span>
                            <span className={`${styles.infoValue} ${styles.price}`}>
                              {formatPrice(generalPrices[card.cardId])}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* For Sale Button - only in collection */}
                    {type === 'collection' && isAuthenticated && (
                      <button
                        type="button"
                        className={`${styles.btnForSale} ${card.isForSale ? styles.forSaleActive : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleForSale(card.cardId, !!card.isForSale, card.cardName);
                        }}
                        disabled={isTogglingForSale === card.cardId}
                        title={card.isForSale ? t('list.forSale.remove') : t('list.forSale.add')}
                        style={{ '--remove-text': `'${t('list.forSale.remove')}'` } as React.CSSProperties}
                      >
                        {isTogglingForSale === card.cardId ? (
                          '...'
                        ) : card.isForSale ? (
                          t('list.forSale.active')
                        ) : (
                          t('list.forSale.add')
                        )}
                      </button>
                    )}
                  </div>

                  {/* Notes */}
                  {card.notes && (
                    <p className={styles.cardNotes}>{card.notes}</p>
                  )}

                  {/* Date */}
                  <div className={styles.cardDate}>
                    {t('list.addedOn')} {new Date(card.addedAt).toLocaleDateString('es-MX')}
                  </div>
                </div>

                {/* Remove Button */}
                {isAuthenticated && (
                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      className={styles.btnRemove}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeCard(card.cardId, card.cardName);
                      }}
                      disabled={isRemoving === card.cardId}
                    >
                      {isRemoving === card.cardId ? (
                        <div className={styles.spinner} />
                      ) : (
                        t('list.remove')
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
