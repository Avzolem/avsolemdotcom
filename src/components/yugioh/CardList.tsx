'use client';

import { useState, useEffect, useMemo } from 'react';
import { CardInList, ListType } from '@/types/yugioh';
import { formatPrice, getCardById, getCardPrice } from '@/lib/services/ygoprodeck';
import { useYugiohAuth } from '@/contexts/YugiohAuthContext';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
import { useToast } from '@/contexts/ToastContext';
import ExportButtons from './ExportButtons';
import PriceStats from './PriceStats';
import ShareButton from './ShareButton';
import Image from 'next/image';
import styles from './CardList.module.scss';

interface CardListProps {
  type: ListType;
  title?: string;
}

export default function CardList({ type, title }: CardListProps) {
  const { isAuthenticated } = useYugiohAuth();
  const { t } = useYugiohLanguage();
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
  const [generalPrices, setGeneralPrices] = useState<Record<number, number>>({});

  const loadCards = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/yugioh/lists/${type}`);
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

      const prices: Record<number, number> = {};

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

  const removeCard = async (setCode: string, cardName: string) => {
    console.log('removeCard called:', { setCode, type });
    if (!confirm(t('list.confirmDelete'))) return;

    setIsRemoving(setCode);

    try {
      const response = await fetch(`/api/yugioh/lists/${type}?setCode=${encodeURIComponent(setCode)}`, {
        method: 'DELETE',
      });

      console.log('removeCard response:', response.status, response.ok);

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
          // Deleted from multiple lists
          const lists = deletedFrom.map((t: ListType) => listNames[t]).join(' y ');
          message = (
            <>
              🗑️ <span style={{ color: '#22C55E', fontWeight: 700 }}>{cardName}</span>
              {' '}(<span style={{ color: '#FFD700', fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{setCode}</span>)
              {' '}{t('list.deletedFrom')} {lists}
            </>
          );
        } else {
          // Deleted from single list
          message = (
            <>
              🗑️ <span style={{ color: '#22C55E', fontWeight: 700 }}>{cardName}</span>
              {' '}(<span style={{ color: '#FFD700', fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{setCode}</span>)
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

  const updateQuantity = async (setCode: string, newQuantity: number) => {
    console.log('updateQuantity called:', { setCode, newQuantity, type });

    // Guardar estado anterior para poder revertir
    const previousCards = cards;
    const previousTotal = totalValue;

    // Actualizar optimísticamente la UI y el valor total
    const updatedCards = cards.map(card =>
      card.setCode === setCode
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
      const response = await fetch(`/api/yugioh/lists/${type}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setCode, quantity: newQuantity }),
      });

      console.log('updateQuantity response:', response.status, response.ok);

      if (!response.ok) {
        console.error('Failed to update quantity:', await response.text());
        // Revertir si falla
        setCards(previousCards);
        setTotalValue(previousTotal);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Revertir si hay error
      setCards(previousCards);
      setTotalValue(previousTotal);
    }
  };

  const toggleForSale = async (setCode: string, currentForSale: boolean, cardName: string) => {
    setIsTogglingForSale(setCode);

    try {
      const response = await fetch('/api/yugioh/toggle-for-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setCode }),
      });

      if (response.ok) {
        const data = await response.json();
        const newIsForSale = data.isForSale;

        // Actualizar optimísticamente el estado local
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.setCode === setCode ? { ...card, isForSale: newIsForSale } : card
          )
        );

        // Mostrar toast
        if (newIsForSale) {
          showToast(
            <>
              ✓ <span style={{ color: '#22C55E', fontWeight: 700 }}>{cardName}</span>
              {' '}(<span style={{ color: '#FFD700', fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{setCode}</span>)
              {' '}{t('list.forSale.addedToast')}
            </>,
            'success'
          );
        } else {
          showToast(
            <>
              <span style={{ color: '#22C55E', fontWeight: 700 }}>{cardName}</span>
              {' '}(<span style={{ color: '#FFD700', fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{setCode}</span>)
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

  // Filtrar cartas localmente
  const filteredCards = useMemo(() => {
    if (!searchTerm) return cards;

    return cards.filter(card =>
      card.cardName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cards, searchTerm]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className="yugioh-skeleton" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
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
                ✕
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
          <div className={styles.emptyIcon}>📦</div>
          <h2 className={styles.emptyTitle}>{t('list.empty.title')}</h2>
          <p className={styles.emptyText}>{t('list.empty.description')}</p>
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
            <div key={card.setCode} className={styles.cardItem}>
              {/* Card Image */}
              <div className={styles.cardImageWrapper}>
                <div className={styles.cardImage}>
                  <Image
                    src={card.localImagePath || card.cardImage}
                    alt={card.cardName}
                    width={100}
                    height={146}
                    unoptimized={!card.localImagePath}
                    className={styles.smallImage}
                  />
                  <div className={styles.imageZoomOverlay}>
                    <Image
                      src={card.localImagePath || card.cardImage}
                      alt={card.cardName}
                      width={300}
                      height={439}
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
                  {/* Set Code Information */}
                  <div className={styles.setInfoSection}>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>{t('list.setCode')}</span>
                      <span className={styles.setCodeValue}>{card.setCode}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>{t('list.set')}</span>
                      <span className={styles.infoValue}>{card.setName}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>{t('list.rarity')}</span>
                      <span className={styles.rarityValue}>{card.setRarity}</span>
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
                            updateQuantity(card.setCode, card.quantity - 1);
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
                            updateQuantity(card.setCode, card.quantity + 1);
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
                      // Has set price
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>{t('list.price')}</span>
                        <span className={`${styles.infoValue} ${styles.price}`}>
                          {formatPrice(card.price)}
                        </span>
                      </div>
                    ) : (
                      // Set price is $0 - show general price fallback
                      <div className={styles.priceWithFallback}>
                        <div className={styles.priceRowFallback}>
                          <span className={styles.infoLabel}>{t('list.priceSet')}</span>
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
                          toggleForSale(card.setCode, !!card.isForSale, card.cardName);
                        }}
                        disabled={isTogglingForSale === card.setCode}
                        title={card.isForSale ? t('list.forSale.remove') : t('list.forSale.add')}
                      >
                        {isTogglingForSale === card.setCode ? (
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
                        removeCard(card.setCode, card.cardName);
                      }}
                      disabled={isRemoving === card.setCode}
                    >
                      {isRemoving === card.setCode ? (
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
