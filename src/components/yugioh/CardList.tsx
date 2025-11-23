'use client';

import { useState, useEffect, useMemo } from 'react';
import { CardInList, ListType } from '@/types/yugioh';
import { formatPrice } from '@/lib/services/ygoprodeck';
import { useYugiohAuth } from '@/contexts/YugiohAuthContext';
import { useToast } from '@/contexts/ToastContext';
import ExportButtons from './ExportButtons';
import PriceStats from './PriceStats';
import ShareButton from './ShareButton';
import Image from 'next/image';
import styles from './CardList.module.scss';

interface CardListProps {
  type: ListType;
  title: string;
}

export default function CardList({ type, title }: CardListProps) {
  const { isAuthenticated } = useYugiohAuth();
  const { showToast } = useToast();
  const [cards, setCards] = useState<CardInList[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [isTogglingForSale, setIsTogglingForSale] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const removeCard = async (setCode: string) => {
    console.log('removeCard called:', { setCode, type });
    if (!confirm('¿Seguro que quieres eliminar esta carta?')) return;

    setIsRemoving(setCode);

    try {
      const response = await fetch(`/api/yugioh/lists/${type}?setCode=${encodeURIComponent(setCode)}`, {
        method: 'DELETE',
      });

      console.log('removeCard response:', response.status, response.ok);

      if (response.ok) {
        await loadCards();
      } else {
        const errorText = await response.text();
        console.error('Failed to remove card:', errorText);
        alert('Error al eliminar la carta');
      }
    } catch (error) {
      console.error('Error removing card:', error);
      alert('Error al eliminar la carta');
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
              {' '}puesta en venta
            </>,
            'success'
          );
        } else {
          showToast(
            <>
              <span style={{ color: '#22C55E', fontWeight: 700 }}>{cardName}</span>
              {' '}(<span style={{ color: '#FFD700', fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>{setCode}</span>)
              {' '}quitada de venta
            </>,
            'info'
          );
        }
      } else {
        showToast('Error al cambiar estado de venta', 'error');
      }
    } catch (error) {
      console.error('Error toggling for-sale:', error);
      showToast('Error al cambiar estado de venta', 'error');
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
        <p>Cargando {title.toLowerCase()}...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.headerRow}>
          <span className={`${styles.badge} ${styles.brand}`}>
            {cards.length} {cards.length === 1 ? 'carta' : 'cartas'}
          </span>
          <span className={`${styles.badge} ${styles.accent}`}>
            Valor Total: {formatPrice(totalValue)}
          </span>
          <ExportButtons cards={cards} listName={title} totalValue={totalValue} />
          {isAuthenticated && <ShareButton listType={type} listName={title} />}
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
              placeholder="Buscar en esta lista..."
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
              Mostrando {filteredCards.length} de {cards.length} cartas
            </p>
          )}
        </div>
      )}

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📦</div>
          <h2 className={styles.emptyTitle}>Lista vacía</h2>
          <p className={styles.emptyText}>No hay cartas en esta lista todavía.</p>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔍</div>
          <h2 className={styles.emptyTitle}>No se encontraron cartas</h2>
          <p className={styles.emptyText}>No hay cartas que coincidan con los filtros aplicados.</p>
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
                      <span className={styles.infoLabel}>Set Code:</span>
                      <span className={styles.setCodeValue}>{card.setCode}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Set:</span>
                      <span className={styles.infoValue}>{card.setName}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Rareza:</span>
                      <span className={styles.rarityValue}>{card.setRarity}</span>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Cantidad:</span>
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
                    {card.price && (
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Precio:</span>
                        <span className={`${styles.infoValue} ${styles.price}`}>
                          {formatPrice(card.price)}
                        </span>
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
                        title={card.isForSale ? 'Quitar de venta' : 'Poner en venta'}
                      >
                        {isTogglingForSale === card.setCode ? (
                          '...'
                        ) : card.isForSale ? (
                          '💰 En Venta'
                        ) : (
                          'Poner en venta'
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
                    Agregada: {new Date(card.addedAt).toLocaleDateString('es-MX')}
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
                        removeCard(card.setCode);
                      }}
                      disabled={isRemoving === card.setCode}
                    >
                      {isRemoving === card.setCode ? (
                        <div className={styles.spinner} />
                      ) : (
                        '🗑️ Eliminar'
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
