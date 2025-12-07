'use client';

import { useState, useEffect, use } from 'react';
import { CardInList } from '@/types/yugioh';
import { formatPrice } from '@/lib/services/ygoprodeck';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';

interface SharedListViewProps {
  params: Promise<{ token: string }>;
}

export default function SharedListView({ params }: SharedListViewProps) {
  const { t, language } = useYugiohLanguage();
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
          setError(data.message || t('shared.error.load'));
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
        setError(t('shared.error.generic'));
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedList();
  }, [resolvedParams.token, t]);

  const getListTitle = () => {
    switch (listType) {
      case 'collection':
        return t('shared.collection');
      case 'for-sale':
        return t('shared.forSale');
      case 'wishlist':
        return t('shared.wishlist');
      default:
        return t('shared.list');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col w-full items-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
        <span className="text-gray-500 dark:text-gray-400 mt-4">
          {t('shared.loading')}
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
          {t('shared.backToManager')}
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
            🔗 {t('shared.publicView')}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {getListTitle()}
        </h1>
        <div className="flex gap-4 flex-wrap">
          <span className="px-3 py-1 text-sm bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 rounded-full">
            {cards.length} {cards.length === 1 ? (language === 'es' ? 'carta' : 'card') : (language === 'es' ? 'cartas' : 'cards')}
          </span>
          <span className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full">
            {t('list.totalValue')}: {formatPrice(totalValue)}
          </span>
          {expiresAt && (
            <span className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full">
              {t('shared.expires')} {new Date(expiresAt).toLocaleDateString(language === 'es' ? 'es-MX' : 'en-US')}
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
            {t('shared.emptyList')}
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
                    {t('shared.quantity')}
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {card.quantity}
                  </span>
                </div>

                {card.price && (
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t('shared.price')}
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
                  {t('shared.added')} {new Date(card.addedAt).toLocaleDateString(language === 'es' ? 'es-MX' : 'en-US')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col items-center py-6 gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
          {t('shared.wantYourOwn')}
        </span>
        <Link href="/yugioh" className="text-cyan-600 dark:text-cyan-400 hover:underline">
          {t('shared.goToManager')}
        </Link>
      </div>
    </div>
  );
}
