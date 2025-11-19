'use client';

import { useState, useEffect } from 'react';
import { CardInList, ListType } from '@/types/yugioh';
import { formatPrice } from '@/lib/services/ygoprodeck';
import { useYugiohAuth } from '@/contexts/YugiohAuthContext';
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
  const [cards, setCards] = useState<CardInList[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState<number | null>(null);

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
  }, [type]);

  const removeCard = async (cardId: number) => {
    console.log('removeCard called:', { cardId, type });
    if (!confirm('¿Seguro que quieres eliminar esta carta?')) return;

    setIsRemoving(cardId);

    try {
      const response = await fetch(`/api/yugioh/lists/${type}?cardId=${cardId}`, {
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

  const updateQuantity = async (cardId: number, newQuantity: number) => {
    console.log('updateQuantity called:', { cardId, newQuantity, type });

    // Actualizar optimísticamente la UI
    setCards(prevCards =>
      prevCards.map(card =>
        card.cardId === cardId
          ? { ...card, quantity: newQuantity }
          : card
      )
    );

    try {
      const response = await fetch(`/api/yugioh/lists/${type}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, quantity: newQuantity }),
      });

      console.log('updateQuantity response:', response.status, response.ok);

      if (!response.ok) {
        console.error('Failed to update quantity:', await response.text());
        // Revertir si falla
        await loadCards();
      } else {
        // Actualizar el valor total sin recargar
        const data = await response.json();
        setTotalValue(data.totalValue || 0);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Revertir si hay error
      await loadCards();
    }
  };

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
      <PriceStats cards={cards} />

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📦</div>
          <h2 className={styles.emptyTitle}>Lista vacía</h2>
          <p className={styles.emptyText}>No hay cartas en esta lista todavía.</p>
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {cards.map((card) => (
            <div key={card.cardId} className={styles.cardItem}>
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

                  {/* Price */}
                  {card.price && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Precio:</span>
                      <span className={`${styles.infoValue} ${styles.price}`}>
                        {formatPrice(card.price)}
                      </span>
                    </div>
                  )}

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
                        removeCard(card.cardId);
                      }}
                      disabled={isRemoving === card.cardId}
                    >
                      {isRemoving === card.cardId ? (
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
