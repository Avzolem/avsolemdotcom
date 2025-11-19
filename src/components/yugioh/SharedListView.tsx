'use client';

import { useState, useEffect, use } from 'react';
import { CardInList } from '@/types/yugioh';
import { formatPrice } from '@/lib/services/ygoprodeck';
import Link from 'next/link';
import {
  Column,
  Row,
  Text,
  Heading,
  Badge,
  Spinner,
  Grid,
} from '@once-ui-system/core';
import Image from 'next/image';

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
      <Column fillWidth alignItems="center" paddingY="64">
        <Spinner size="l" />
        <Text variant="body-default-m" onBackground="neutral-weak">
          Cargando lista compartida...
        </Text>
      </Column>
    );
  }

  if (error) {
    return (
      <Column fillWidth alignItems="center" paddingY="64" gap="16">
        <Text variant="heading-default-xl" align="center">
          ⚠️
        </Text>
        <Heading variant="heading-strong-l" align="center">
          {error}
        </Heading>
        <Link href="/yugioh">
          <Text variant="body-default-m" onBackground="brand-strong">
            Volver a Yu-Gi-Oh! Manager
          </Text>
        </Link>
      </Column>
    );
  }

  return (
    <Column fillWidth gap="24">
      {/* Header */}
      <Column gap="12">
        <Row gap="12" alignItems="center">
          <Text variant="body-default-s" onBackground="neutral-weak">
            🔗 Vista Pública
          </Text>
        </Row>
        <Heading variant="heading-strong-xl">{getListTitle()}</Heading>
        <Row gap="16" wrap>
          <Badge variant="brand" size="l">
            {cards.length} {cards.length === 1 ? 'carta' : 'cartas'}
          </Badge>
          <Badge variant="accent" size="l">
            Valor Total: {formatPrice(totalValue)}
          </Badge>
          {expiresAt && (
            <Badge variant="neutral" size="s">
              Expira: {new Date(expiresAt).toLocaleDateString('es-MX')}
            </Badge>
          )}
        </Row>
      </Column>

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <Column
          fillWidth
          alignItems="center"
          paddingY="64"
          gap="16"
        >
          <Text variant="heading-default-xl" onBackground="neutral-weak" align="center">
            📦
          </Text>
          <Text variant="heading-strong-l" align="center">
            Lista vacía
          </Text>
        </Column>
      ) : (
        <Grid columns="repeat(auto-fill, minmax(280px, 1fr))" gap="16" fillWidth>
          {cards.map((card) => (
            <Column
              key={card.cardId}
              gap="12"
              padding="16"
              background="surface"
              border="neutral-medium"
              borderStyle="solid-1"
              radius="m"
            >
              {/* Card Image */}
              <Column fillWidth alignItems="center">
                <Image
                  src={card.localImagePath || card.cardImage}
                  alt={card.cardName}
                  width={200}
                  height={292}
                  style={{ borderRadius: '4px', objectFit: 'contain' }}
                  unoptimized={!card.localImagePath}
                />
              </Column>

              {/* Card Info */}
              <Column gap="8">
                <Heading variant="heading-strong-s">{card.cardName}</Heading>

                <Row gap="8" alignItems="center">
                  <Text variant="label-default-s" onBackground="neutral-weak">
                    Cantidad:
                  </Text>
                  <Text variant="body-default-m">{card.quantity}</Text>
                </Row>

                {card.price && (
                  <Row gap="8" alignItems="center">
                    <Text variant="label-default-s" onBackground="neutral-weak">
                      Precio:
                    </Text>
                    <Text variant="body-default-m" onBackground="brand-strong">
                      {formatPrice(card.price)}
                    </Text>
                  </Row>
                )}

                {card.notes && (
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    {card.notes}
                  </Text>
                )}

                <Text variant="label-default-xs" onBackground="neutral-weak">
                  Agregada: {new Date(card.addedAt).toLocaleDateString('es-MX')}
                </Text>
              </Column>
            </Column>
          ))}
        </Grid>
      )}

      {/* Footer */}
      <Column alignItems="center" paddingY="24" gap="8">
        <Text variant="body-default-s" onBackground="neutral-weak" align="center">
          ¿Quieres tu propia colección Yu-Gi-Oh!?
        </Text>
        <Link href="/yugioh">
          <Text variant="body-default-m" onBackground="brand-strong">
            Ir a Yu-Gi-Oh! Manager
          </Text>
        </Link>
      </Column>
    </Column>
  );
}
