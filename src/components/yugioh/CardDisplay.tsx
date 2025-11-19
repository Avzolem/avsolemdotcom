'use client';

import { useState, memo } from 'react';
import { YugiohCard, ListType } from '@/types/yugioh';
import { getCardPrice, formatPrice } from '@/lib/services/ygoprodeck';
import { useYugiohAuth } from '@/contexts/YugiohAuthContext';
import Image from 'next/image';
import styles from './CardDisplay.module.scss';

interface CardDisplayProps {
  card: YugiohCard;
  compact?: boolean;
}

function CardDisplay({ card, compact = false }: CardDisplayProps) {
  const { isAuthenticated } = useYugiohAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [addedTo, setAddedTo] = useState<string | null>(null);

  const price = getCardPrice(card);
  const imageUrl = card.card_images[0]?.image_url_small || card.card_images[0]?.image_url;

  const addToList = async (type: ListType) => {
    setIsAdding(true);
    setAddedTo(null);

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

      // Add card to list
      const response = await fetch(`/api/yugioh/lists/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: card.id,
          cardName: card.name,
          cardImage: imageUrl,
          localImagePath: localImagePath,
          quantity: 1,
          price: price,
        }),
      });

      if (response.ok) {
        const listNames = {
          collection: 'Colección',
          'for-sale': 'En Venta',
          wishlist: 'Wishlist',
        };
        setAddedTo(listNames[type]);
        setTimeout(() => setAddedTo(null), 3000);
      } else {
        alert('Error al agregar la carta');
      }
    } catch (error) {
      console.error('Error adding card:', error);
      alert('Error al agregar la carta');
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
              <span className={styles.badge}>{card.type}</span>
              {card.attribute && <span className={styles.badgeAccent}>{card.attribute}</span>}
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
            <span className={styles.badge}>{card.type}</span>
            {card.race && <span className={styles.badge}>{card.race}</span>}
            {card.attribute && <span className={styles.badgeAccent}>{card.attribute}</span>}
            {card.archetype && <span className={styles.badgeBrand}>{card.archetype}</span>}
          </div>
        </div>

        {/* Stats for Monster Cards */}
        {(card.atk !== undefined || card.def !== undefined) && (
          <div className={styles.stats}>
            {card.level !== undefined && (
              <div className={styles.stat}>
                <strong>Nivel:</strong> {card.level}
              </div>
            )}
            {card.atk !== undefined && (
              <div className={styles.stat}>
                <strong>ATK:</strong> {card.atk}
              </div>
            )}
            {card.def !== undefined && (
              <div className={styles.stat}>
                <strong>DEF:</strong> {card.def}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <div className={styles.description}>
          <p className={styles.descLabel}>Descripción:</p>
          <p className={styles.descText}>{card.desc}</p>
        </div>

        {/* Price */}
        <div className={styles.priceSection}>
          <span className={styles.priceLabel}>Precio estimado:</span>
          <span className={styles.priceValue}>{formatPrice(price)}</span>
        </div>

        {/* Add to List Buttons */}
        {isAuthenticated && (
          <div className={styles.actions}>
            {addedTo && (
              <div className={styles.successMessage}>
                ✓ Agregada a {addedTo}
              </div>
            )}

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
                {isAdding ? '...' : '+ Colección'}
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
                {isAdding ? '...' : '+ En Venta'}
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
                {isAdding ? '...' : '+ Wishlist'}
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
