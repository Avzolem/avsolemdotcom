'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePokemonAuth } from '@/contexts/PokemonAuthContext';
import { usePokemonLanguage } from '@/contexts/PokemonLanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { PokemonDeck, PokemonCard, CardInDeck, DeckZone, DECK_LIMITS, getCardZone, isBasicEnergy } from '@/types/pokemon';
import DeckStats from '@/components/pokemon/DeckStats';
import styles from './DeckBuilder.module.scss';

interface DeckBuilderProps {
  deckId: string;
}

export default function DeckBuilder({ deckId }: DeckBuilderProps) {
  const { isAuthenticated, isLoading: authLoading } = usePokemonAuth();
  const { t } = usePokemonLanguage();
  const { showToast } = useToast();
  const router = useRouter();

  const [deck, setDeck] = useState<PokemonDeck | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PokemonCard[]>([]);
  const [searching, setSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Export PDF state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPlayerName, setExportPlayerName] = useState('');
  const [exportPlayPokemonId, setExportPlayPokemonId] = useState('');
  const [exportEventName, setExportEventName] = useState('');
  const [exportEventDate, setExportEventDate] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchDeck = useCallback(async () => {
    try {
      const res = await fetch(`/api/pokemon/decks/${deckId}`);
      if (!res.ok) {
        router.push('/pokemon/decks');
        return;
      }
      const data = await res.json();
      setDeck(data.deck);
      setNameInput(data.deck.name);
    } catch {
      showToast(t('deck.error.fetch'), 'error');
      router.push('/pokemon/decks');
    } finally {
      setLoading(false);
    }
  }, [deckId, router, showToast, t]);

  useEffect(() => {
    if (!authLoading) {
      fetchDeck();
    }
  }, [authLoading, fetchDeck]);

  // Search with debounce - calls server-side API proxy (TCGdex)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchTerm || searchTerm.trim().length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/pokemon/search?name=${encodeURIComponent(searchTerm.trim())}&limit=20`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults((data.data || []).slice(0, 20));
        } else {
          setSearchResults([]);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const getAutoZone = (card: PokemonCard): DeckZone => {
    return getCardZone(card.supertype);
  };

  const handleAddCard = async (card: PokemonCard, targetZone?: DeckZone) => {
    if (!deck) return;

    const zone = targetZone || getAutoZone(card);
    const cardData: Omit<CardInDeck, 'quantity' | 'zone'> = {
      cardId: card.id,
      cardName: card.name,
      cardImage: card.images.small || '',
      cardType: card.supertype,
      subtypes: card.subtypes || [],
      hp: card.hp != null ? String(card.hp) : undefined,
      types: card.types,
    };

    // Optimistic update
    const updatedCards = [...deck.cards];
    const existingIdx = updatedCards.findIndex(
      (c) => c.cardId === card.id && c.zone === zone
    );

    if (existingIdx >= 0) {
      updatedCards[existingIdx] = {
        ...updatedCards[existingIdx],
        quantity: updatedCards[existingIdx].quantity + 1,
      };
    } else {
      updatedCards.push({ ...cardData, quantity: 1, zone });
    }

    setDeck({ ...deck, cards: updatedCards });

    try {
      const res = await fetch(`/api/pokemon/decks/${deckId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addCard', card: cardData, zone, quantity: 1 }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Revert optimistic update
        setDeck({ ...deck });
        const errorKey = `deck.error.${data.message}` as Parameters<typeof t>[0];
        showToast(t(errorKey) || data.message, 'error');
        return;
      }

      showToast(`${card.name} ${t('deck.toast.cardAdded')}`, 'success');
    } catch {
      setDeck({ ...deck });
      showToast(t('deck.error.addCard'), 'error');
    }
  };

  const handleRemoveCard = async (cardId: string, zone: DeckZone) => {
    if (!deck) return;

    // Optimistic update
    const updatedCards = [...deck.cards];
    const idx = updatedCards.findIndex((c) => c.cardId === cardId && c.zone === zone);
    if (idx === -1) return;

    const oldCards = [...deck.cards];
    if (updatedCards[idx].quantity > 1) {
      updatedCards[idx] = { ...updatedCards[idx], quantity: updatedCards[idx].quantity - 1 };
    } else {
      updatedCards.splice(idx, 1);
    }
    setDeck({ ...deck, cards: updatedCards });

    try {
      const res = await fetch(`/api/pokemon/decks/${deckId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'removeCard', cardId, zone }),
      });

      if (!res.ok) {
        setDeck({ ...deck, cards: oldCards });
        showToast(t('deck.error.removeCard'), 'error');
      }
    } catch {
      setDeck({ ...deck, cards: oldCards });
      showToast(t('deck.error.removeCard'), 'error');
    }
  };

  const handleSaveName = async () => {
    if (!deck || !nameInput.trim()) return;
    setEditingName(false);

    try {
      await fetch(`/api/pokemon/decks/${deckId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput.trim() }),
      });
      setDeck({ ...deck, name: nameInput.trim() });
    } catch {
      showToast(t('deck.error.update'), 'error');
    }
  };

  const getZoneCards = (zone: DeckZone) =>
    deck?.cards.filter((c) => c.zone === zone) || [];

  const getZoneCount = (zone: DeckZone) =>
    getZoneCards(zone).reduce((s, c) => s + c.quantity, 0);

  const getTotalDeckCount = () => {
    return (deck?.cards || []).reduce((s, c) => s + c.quantity, 0);
  };

  const handleExportPdf = async () => {
    if (!deck || !exportPlayerName.trim()) return;
    setExporting(true);
    try {
      const { exportDeckToPdf } = await import('@/lib/services/pokemonDeckPdfExport');
      await exportDeckToPdf(deck, {
        playerName: exportPlayerName.trim(),
        playPokemonId: exportPlayPokemonId.trim() || undefined,
        eventName: exportEventName.trim() || undefined,
        eventDate: exportEventDate || undefined,
      });
      showToast(t('deck.export.success'), 'success');
      setShowExportModal(false);
    } catch {
      showToast(t('deck.export.error'), 'error');
    } finally {
      setExporting(false);
    }
  };

  // Count how many copies of a card exist across all zones
  const getTotalCopies = (cardId: string) =>
    deck?.cards
      .filter((c) => c.cardId === cardId)
      .reduce((s, c) => s + c.quantity, 0) || 0;

  // Check if a card can be added (Basic Energy has unlimited copies)
  const canAddCard = (card: PokemonCard) => {
    const copies = getTotalCopies(card.id);
    if (isBasicEnergy(card.name, card.subtypes)) {
      return true; // Unlimited basic energy
    }
    return copies < DECK_LIMITS.MAX_COPIES;
  };

  const getMaxCopiesLabel = (card: PokemonCard) => {
    if (isBasicEnergy(card.name, card.subtypes)) {
      return '\u221E'; // infinity symbol
    }
    return String(DECK_LIMITS.MAX_COPIES);
  };

  if (loading || authLoading) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner} />
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (!isAuthenticated || !deck) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>&#x1F512;</span>
        <h2 className={styles.emptyTitle}>{t('deck.notFound')}</h2>
      </div>
    );
  }

  const totalCount = getTotalDeckCount();
  const deckValid = totalCount === DECK_LIMITS.DECK_SIZE;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/pokemon/decks')}>
          &larr; {t('deck.backToDecks')}
        </button>
        <div className={styles.titleRow}>
          {editingName ? (
            <input
              className={styles.titleInput}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              autoFocus
              maxLength={50}
            />
          ) : (
            <h1
              className={styles.title}
              onClick={() => setEditingName(true)}
              title={t('deck.clickToEdit')}
            >
              {deck.name}
              <span className={styles.editIcon}>&#x270F;&#xFE0F;</span>
            </h1>
          )}
          <span className={`${styles.deckTotal} ${deckValid ? styles.deckTotalValid : styles.deckTotalInvalid}`}>
            {totalCount}/{DECK_LIMITS.DECK_SIZE}
          </span>
          <button
            className={styles.exportBtn}
            onClick={() => setShowExportModal(true)}
          >
            &#x1F4C4; {t('deck.export.pdf')}
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Left: Search Panel */}
        <div className={styles.searchPanel}>
          <div className={styles.searchBar}>
            <input
              type="text"
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('deck.searchPlaceholder')}
            />
            {searchTerm && (
              <button
                className={styles.clearBtn}
                onClick={() => { setSearchTerm(''); setSearchResults([]); }}
              >
                &#x2715;
              </button>
            )}
          </div>

          {searching && (
            <div className={styles.searchLoading}>
              <span className={styles.spinnerSmall} />
              {t('search.loading')}
            </div>
          )}

          <div className={styles.searchResults}>
            {searchResults.map((card) => {
              const copies = getTotalCopies(card.id);
              const canAdd = canAddCard(card);
              const autoZone = getAutoZone(card);
              return (
                <div key={card.id} className={styles.searchCard}>
                  <div className={styles.searchCardImage}>
                    <Image
                      src={card.images.small || ''}
                      alt={card.name}
                      width={48}
                      height={67}
                      className={styles.cardThumb}
                    />
                  </div>
                  <div className={styles.searchCardInfo}>
                    <span className={styles.searchCardName}>{card.name}</span>
                    <span className={styles.searchCardType}>
                      {card.supertype}
                      {card.subtypes && card.subtypes.length > 0 && ` - ${card.subtypes.join(', ')}`}
                    </span>
                    {card.hp && (
                      <span className={styles.searchCardLevel}>
                        HP {card.hp}
                        {card.types && card.types.length > 0 && ` | ${card.types.join('/')}`}
                      </span>
                    )}
                    {copies > 0 && (
                      <span className={styles.copiesLabel}>
                        {copies}/{getMaxCopiesLabel(card)}
                      </span>
                    )}
                  </div>
                  <div className={styles.searchCardActions}>
                    <button
                      className={styles.addBtn}
                      onClick={() => handleAddCard(card)}
                      disabled={!canAdd}
                      title={`${t('deck.addTo')} ${autoZone}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Deck Zones */}
        <div className={styles.deckPanel}>
          {/* Pokemon Zone */}
          <DeckZoneSection
            title={`Pokemon (${getZoneCount('pokemon')})`}
            zone="pokemon"
            cards={getZoneCards('pokemon')}
            onRemove={handleRemoveCard}
            valid={getZoneCount('pokemon') > 0}
          />

          {/* Trainer Zone */}
          <DeckZoneSection
            title={`Trainer (${getZoneCount('trainer')})`}
            zone="trainer"
            cards={getZoneCards('trainer')}
            onRemove={handleRemoveCard}
            valid={true}
          />

          {/* Energy Zone */}
          <DeckZoneSection
            title={`Energy (${getZoneCount('energy')})`}
            zone="energy"
            cards={getZoneCards('energy')}
            onRemove={handleRemoveCard}
            valid={true}
          />
        </div>

        {/* Right: Stats */}
        <div className={styles.statsPanel}>
          <h3 className={styles.statsPanelTitle}>{t('deck.stats.title')}</h3>
          <DeckStats cards={deck.cards} />
        </div>
      </div>

      {/* Export PDF Modal */}
      {showExportModal && (
        <div className={styles.modalOverlay} onClick={() => setShowExportModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>{t('deck.export.title')}</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('deck.export.playerName')} *</label>
              <input
                type="text"
                className={styles.formInput}
                value={exportPlayerName}
                onChange={(e) => setExportPlayerName(e.target.value)}
                placeholder={t('deck.export.playerNamePlaceholder')}
                autoFocus
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Play! Pokemon ID</label>
              <input
                type="text"
                className={styles.formInput}
                value={exportPlayPokemonId}
                onChange={(e) => setExportPlayPokemonId(e.target.value)}
                placeholder="Ej: 12345678"
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('deck.export.eventName')}</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={exportEventName}
                  onChange={(e) => setExportEventName(e.target.value)}
                  placeholder={t('deck.export.eventNamePlaceholder')}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('deck.export.eventDate')}</label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={exportEventDate}
                  onChange={(e) => setExportEventDate(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.btnCancel}
                onClick={() => setShowExportModal(false)}
              >
                {t('common.cancel')}
              </button>
              <button
                className={styles.btnExport}
                onClick={handleExportPdf}
                disabled={exporting || !exportPlayerName.trim()}
              >
                {exporting ? t('deck.export.generating') : t('deck.export.download')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component: Zone section
function DeckZoneSection({
  title,
  zone,
  cards,
  onRemove,
  valid,
}: {
  title: string;
  zone: DeckZone;
  cards: CardInDeck[];
  onRemove: (cardId: string, zone: DeckZone) => void;
  valid: boolean;
}) {
  return (
    <div className={styles.zoneSection}>
      <h3 className={`${styles.zoneTitle} ${valid ? styles.zoneValid : styles.zoneInvalid}`}>
        {title}
      </h3>
      <div className={styles.zoneGrid}>
        {cards.map((card) => (
          <div key={`${card.cardId}-${zone}`} className={styles.deckCard}>
            <div className={styles.deckCardImage}>
              <Image
                src={card.cardImage}
                alt={card.cardName}
                width={60}
                height={84}
                className={styles.deckCardThumb}
              />
              {card.quantity > 1 && (
                <span className={styles.quantityBadge}>x{card.quantity}</span>
              )}
            </div>
            <button
              className={styles.removeBtn}
              onClick={() => onRemove(card.cardId, zone)}
              title={card.cardName}
            >
              &#x2212;
            </button>
          </div>
        ))}
        {cards.length === 0 && (
          <div className={styles.zoneEmpty}>
            {zone === 'pokemon' ? '&#x26A1;' : zone === 'trainer' ? '&#x1F3B4;' : '&#x1F525;'}
          </div>
        )}
      </div>
    </div>
  );
}
