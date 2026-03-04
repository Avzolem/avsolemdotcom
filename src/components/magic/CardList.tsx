'use client';

import { useState, useEffect, useMemo } from 'react';
import { CardInList, ListType } from '@/types/magic';
import { formatPrice } from '@/lib/services/scryfall';
import { useMagicAuth } from '@/contexts/MagicAuthContext';
import { useMagicLanguage } from '@/contexts/MagicLanguageContext';
import { useToast } from '@/contexts/ToastContext';
import ExportButtons from './ExportButtons';
import PriceStats from './PriceStats';
import ShareButton from './ShareButton';
import Image from 'next/image';
import styles from './CardList.module.scss';

// Magic rarity configuration
const RARITY_CONFIG: Record<string, { icon: string; className: string }> = {
  'common': { icon: '\u25CF', className: 'rarityCommon' },
  'uncommon': { icon: '\u25C6', className: 'rarityUncommon' },
  'rare': { icon: '\u2605', className: 'rarityRare' },
  'mythic': { icon: '\u2726', className: 'rarityMythic' },
  'special': { icon: '\u2728', className: 'raritySpecial' },
  'bonus': { icon: '\u2606', className: 'rarityBonus' },
};

function getRarityConfig(rarity: string): { icon: string; className: string } {
  const key = rarity.toLowerCase();
  if (RARITY_CONFIG[key]) return RARITY_CONFIG[key];
  return RARITY_CONFIG['common'];
}

interface CardListProps {
  type: ListType;
  title?: string;
}

export default function CardList({ type, title }: CardListProps) {
  const { isAuthenticated } = useMagicAuth();
  const { t } = useMagicLanguage();
  const { showToast } = useToast();

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

  const loadCards = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/magic/lists/${type}`);
      const data = await response.json();

      setCards(data.list?.cards || []);
      setTotalValue(data.totalValue || 0);
    } catch (error) {
      // Failed to load cards
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const removeCard = async (cardId: string, cardName: string) => {
    if (!confirm(t('list.confirmDelete'))) return;

    setIsRemoving(cardId);

    try {
      const response = await fetch(`/api/magic/lists/${type}?cardId=${encodeURIComponent(cardId)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        const deletedFrom = data.deletedFrom || [type];

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
              {'- '}<span style={{ color: '#D4AF37', fontWeight: 700 }}>{cardName}</span>
              {' '}(<span style={{ color: '#9B8ACE', fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{cardId}</span>)
              {' '}{t('list.deletedFrom')} {lists}
            </>
          );
        } else {
          message = (
            <>
              {'- '}<span style={{ color: '#D4AF37', fontWeight: 700 }}>{cardName}</span>
              {' '}(<span style={{ color: '#9B8ACE', fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{cardId}</span>)
              {' '}{t('list.deletedFrom')} {listNames[deletedFrom[0] as ListType]}
            </>
          );
        }

        showToast(message, 'info');
        await loadCards();
      } else {
        showToast(t('list.errorDelete'), 'error');
      }
    } catch (error) {
      showToast(t('list.errorDelete'), 'error');
    } finally {
      setIsRemoving(null);
    }
  };

  const updateQuantity = async (cardId: string, newQuantity: number) => {
    const previousCards = cards;
    const previousTotal = totalValue;

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
      const response = await fetch(`/api/magic/lists/${type}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, quantity: newQuantity }),
      });

      if (!response.ok) {
        setCards(previousCards);
        setTotalValue(previousTotal);
      }
    } catch (error) {
      setCards(previousCards);
      setTotalValue(previousTotal);
    }
  };

  const toggleForSale = async (cardId: string, currentForSale: boolean, cardName: string) => {
    setIsTogglingForSale(cardId);

    try {
      const response = await fetch('/api/magic/toggle-for-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId }),
      });

      if (response.ok) {
        const data = await response.json();
        const newIsForSale = data.isForSale;

        setCards((prevCards) =>
          prevCards.map((card) =>
            card.cardId === cardId ? { ...card, isForSale: newIsForSale } : card
          )
        );

        if (newIsForSale) {
          showToast(
            <>
              {'+ '}<span style={{ color: '#D4AF37', fontWeight: 700 }}>{cardName}</span>
              {' '}{t('list.forSale.addedToast')}
            </>,
            'success'
          );
        } else {
          showToast(
            <>
              <span style={{ color: '#D4AF37', fontWeight: 700 }}>{cardName}</span>
              {' '}{t('list.forSale.removedToast')}
            </>,
            'info'
          );
        }
      } else {
        showToast(t('list.forSale.error'), 'error');
      }
    } catch (error) {
      showToast(t('list.forSale.error'), 'error');
    } finally {
      setIsTogglingForSale(null);
    }
  };

  const filteredCards = useMemo(() => {
    if (!searchTerm) return cards;

    return cards.filter(card =>
      card.cardName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cards, searchTerm]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className="magic-skeleton" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
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
          <ExportButtons cards={cards} listType={type} />
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
          <div className={styles.emptyIcon}>{isAuthenticated ? '\u{1F4E6}' : '\u{1F510}'}</div>
          <h2 className={styles.emptyTitle}>
            {isAuthenticated ? t('list.empty.title') : t('list.empty.notLoggedIn.title')}
          </h2>
          <p className={styles.emptyText}>
            {isAuthenticated ? t('list.empty.description') : t('list.empty.notLoggedIn.description')}
          </p>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>{'\u{1F50D}'}</div>
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
                      <span className={styles.cardIdValue}>{card.cardId.slice(0, 8)}...</span>
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
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>{t('list.price')}</span>
                        <span className={`${styles.infoValue} ${styles.price}`}>
                          {formatPrice(card.price)}
                        </span>
                      </div>
                    ) : (
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>{t('list.price')}</span>
                        <span className={styles.priceUnavailable}>{t('list.priceUnavailable')}</span>
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
