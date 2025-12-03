'use client';

import { useState, useEffect, use } from 'react';
import { CardInList } from '@/types/yugioh';
import { formatPrice } from '@/lib/services/ygoprodeck';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface SharedListViewProps {
  params: Promise<{ token: string }>;
}

export default function SharedListView({ params }: SharedListViewProps) {
  const resolvedParams = use(params);
  const [cards, setCards] = useState<CardInList[]>([]);
  const [listType, setListType] = useState<string>('');
  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expiresAt, setExpiresAt] = useState<string>('');

  useEffect(() => {
    const loadSharedList = async () => {
      try {
        const response = await fetch(`/api/yugioh/share?token=${resolvedParams.token}`);

        if (!response.ok) {
          const data = await response.json();
          setError(data.message || 'No se pudo cargar la lista compartida');
          return;
        }

        const data = await response.json();
        setCards(data.list?.cards || []);
        setListType(data.listType);
        setExpiresAt(data.expiresAt);

        // Calculate total value
        const total = (data.list?.cards || []).reduce(
          (sum: number, card: CardInList) => sum + (card.price || 0) * card.quantity,
          0
        );
        setTotalValue(total);
      } catch (err) {
        console.error('Error loading shared list:', err);
        setError('Error al cargar la lista compartida');
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedList();
  }, [resolvedParams.token]);

  const getListTitle = () => {
    switch (listType) {
      case 'collection':
        return 'Colección Compartida';
      case 'for-sale':
        return 'Cartas en Venta';
      case 'wishlist':
        return 'Wishlist Compartida';
      default:
        return 'Lista Compartida';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col w-full items-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
        <span className="text-gray-500 dark:text-gray-400 mt-4">
          Cargando lista compartida...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full items-center py-16 gap-4">
        <span className="text-4xl text-center">
          ⚠️
        </span>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
          {error}
        </h1>
        <Link href="/yugioh" className="text-cyan-600 dark:text-cyan-400 hover:underline">
          Volver a Yu-Gi-Oh! Manager
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3 items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            🔗 Vista Pública
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {getListTitle()}
        </h1>
        <div className="flex gap-4 flex-wrap">
          <span className="px-3 py-1 text-sm bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 rounded-full">
            {cards.length} {cards.length === 1 ? 'carta' : 'cartas'}
          </span>
          <span className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full">
            Valor Total: {formatPrice(totalValue)}
          </span>
          {expiresAt && (
            <span className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full">
              Expira: {new Date(expiresAt).toLocaleDateString('es-MX')}
            </span>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <div className="flex flex-col w-full items-center py-16 gap-4">
          <span className="text-4xl text-gray-400 dark:text-gray-500 text-center">
            📦
          </span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
            Lista vacía
          </h2>
        </div>
      ) : (
        <div className="flex gap-4 w-full flex-wrap">
          {cards.map((card) => (
            <div
              key={card.cardId}
              className="flex flex-col gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
              style={{ flex: '1 1 280px', minWidth: '280px' }}
            >
              {/* Card Image */}
              <div className="flex w-full justify-center">
                <Image
                  src={card.localImagePath || card.cardImage}
                  alt={card.cardName}
                  width={200}
                  height={292}
                  style={{ borderRadius: '4px', objectFit: 'contain' }}
                  unoptimized={!card.localImagePath}
                />
              </div>

              {/* Card Info */}
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {card.cardName}
                </h3>

                <div className="flex gap-2 items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Cantidad:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {card.quantity}
                  </span>
                </div>

                {card.price && (
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Precio:
                    </span>
                    <span className="text-cyan-600 dark:text-cyan-400">
                      {formatPrice(card.price)}
                    </span>
                  </div>
                )}

                {card.notes && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {card.notes}
                  </p>
                )}

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Agregada: {new Date(card.addedAt).toLocaleDateString('es-MX')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col items-center py-6 gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
          ¿Quieres tu propia colección Yu-Gi-Oh!?
        </span>
        <Link href="/yugioh" className="text-cyan-600 dark:text-cyan-400 hover:underline">
          Ir a Yu-Gi-Oh! Manager
        </Link>
      </div>
    </div>
  );
}
