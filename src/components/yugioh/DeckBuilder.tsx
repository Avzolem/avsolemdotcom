'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useYugiohAuth } from '@/contexts/YugiohAuthContext';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { YugiohDeck, YugiohCard, CardInDeck, DeckZone, DECK_LIMITS, EXTRA_DECK_FRAME_TYPES } from '@/types/yugioh';
import { searchCardsByName } from '@/lib/services/ygoprodeck';
import { exportDeckToPdf } from '@/lib/services/deckPdfExport';
import DeckStats from './DeckStats';
import styles from './DeckBuilder.module.scss';

interface DeckBuilderProps {
  deckId: string;
}

export default function DeckBuilder({ deckId }: DeckBuilderProps) {
  const { isAuthenticated, isLoading: authLoading } = useYugiohAuth();
  const { t } = useYugiohLanguage();
  const { showToast } = useToast();
  const router = useRouter();

  const [deck, setDeck] = useState<YugiohDeck | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<YugiohCard[]>([]);
  const [searching, setSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Export PDF state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPlayerName, setExportPlayerName] = useState('');
  const [exportKonamiId, setExportKonamiId] = useState('');
  const [exportEventName, setExportEventName] = useState('');
  const [exportEventDate, setExportEventDate] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchDeck = useCallback(async () => {
    try {
      const res = await fetch(`/api/yugioh/decks/${deckId}`);
      if (!res.ok) {
        router.push('/yugioh/decks');
        return;
      }
      const data = await res.json();
      setDeck(data.deck);
      setNameInput(data.deck.name);
    } catch {
      showToast(t('deck.error.fetch'), 'error');
      router.push('/yugioh/decks');
    } finally {
      setLoading(false);
    }
  }, [deckId, router, showToast, t]);

  useEffect(() => {
    if (!authLoading) {
      fetchDeck();
    }
  }, [authLoading, fetchDeck]);

  // Search with debounce
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
        const results = await searchCardsByName(searchTerm);
        setSearchResults(results.slice(0, 20));
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

  const getAutoZone = (card: YugiohCard): DeckZone => {
    if (EXTRA_DECK_FRAME_TYPES.includes(card.frameType as typeof EXTRA_DECK_FRAME_TYPES[number])) {
      return 'extra';
    }
    return 'main';
  };

  const handleAddCard = async (card: YugiohCard, targetZone?: DeckZone) => {
    if (!deck) return;

    const zone = targetZone || getAutoZone(card);
    const cardData: Omit<CardInDeck, 'quantity' | 'zone'> = {
      cardId: card.id,
      cardName: card.name,
      cardImage: card.card_images[0]?.image_url_small || '',
      cardType: card.type,
      frameType: card.frameType,
      atk: card.atk,
      def: card.def,
      level: card.level,
      attribute: card.attribute,
      race: card.race,
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
      const res = await fetch(`/api/yugioh/decks/${deckId}`, {
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

  const handleRemoveCard = async (cardId: number, zone: DeckZone) => {
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
      const res = await fetch(`/api/yugioh/decks/${deckId}`, {
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
      await fetch(`/api/yugioh/decks/${deckId}`, {
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

  const handleExportPdf = async () => {
    if (!deck || !exportPlayerName.trim()) return;
    setExporting(true);
    try {
      await exportDeckToPdf(deck, {
        playerName: exportPlayerName.trim(),
        konamiId: exportKonamiId.trim() || undefined,
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
  const getTotalCopies = (cardId: number) =>
    deck?.cards
      .filter((c) => c.cardId === cardId)
      .reduce((s, c) => s + c.quantity, 0) || 0;

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
        <span className={styles.emptyIcon}>🔒</span>
        <h2 className={styles.emptyTitle}>{t('deck.notFound')}</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/yugioh/decks')}>
          ← {t('deck.backToDecks')}
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
              <span className={styles.editIcon}>✏️</span>
            </h1>
          )}
          <button
            className={styles.exportBtn}
            onClick={() => setShowExportModal(true)}
          >
            📄 {t('deck.export.pdf')}
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
                ✕
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
              const canAdd = copies < DECK_LIMITS.MAX_COPIES;
              const autoZone = getAutoZone(card);
              return (
                <div key={card.id} className={styles.searchCard}>
                  <div className={styles.searchCardImage}>
                    <Image
                      src={card.card_images[0]?.image_url_small || ''}
                      alt={card.name}
                      width={48}
                      height={70}
                      className={styles.cardThumb}
                    />
                  </div>
                  <div className={styles.searchCardInfo}>
                    <span className={styles.searchCardName}>{card.name}</span>
                    <span className={styles.searchCardType}>{card.type}</span>
                    {card.level && card.level > 0 && (
                      <span className={styles.searchCardLevel}>
                        {card.frameType === 'xyz' ? 'Rank' : 'Lv'} {card.level}
                        {card.atk !== undefined && ` | ATK ${card.atk}`}
                        {card.def !== undefined && ` | DEF ${card.def}`}
                      </span>
                    )}
                    {copies > 0 && (
                      <span className={styles.copiesLabel}>
                        {copies}/{DECK_LIMITS.MAX_COPIES}
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
                    {autoZone !== 'extra' && (
                      <button
                        className={styles.addSideBtn}
                        onClick={() => handleAddCard(card, 'side')}
                        disabled={!canAdd}
                        title={t('deck.addToSide')}
                      >
                        S
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Deck Zones */}
        <div className={styles.deckPanel}>
          {/* Main Deck */}
          <DeckZoneSection
            title={`Main Deck (${getZoneCount('main')}/${DECK_LIMITS.MAIN_MIN}-${DECK_LIMITS.MAIN_MAX})`}
            zone="main"
            cards={getZoneCards('main')}
            onRemove={handleRemoveCard}
            valid={getZoneCount('main') >= DECK_LIMITS.MAIN_MIN && getZoneCount('main') <= DECK_LIMITS.MAIN_MAX}
          />

          {/* Extra Deck */}
          <DeckZoneSection
            title={`Extra Deck (${getZoneCount('extra')}/${DECK_LIMITS.EXTRA_MAX})`}
            zone="extra"
            cards={getZoneCards('extra')}
            onRemove={handleRemoveCard}
            valid={getZoneCount('extra') <= DECK_LIMITS.EXTRA_MAX}
          />

          {/* Side Deck */}
          <DeckZoneSection
            title={`Side Deck (${getZoneCount('side')}/${DECK_LIMITS.SIDE_MAX})`}
            zone="side"
            cards={getZoneCards('side')}
            onRemove={handleRemoveCard}
            valid={getZoneCount('side') <= DECK_LIMITS.SIDE_MAX}
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
              <label className={styles.formLabel}>{t('deck.export.konamiId')}</label>
              <input
                type="text"
                className={styles.formInput}
                value={exportKonamiId}
                onChange={(e) => setExportKonamiId(e.target.value)}
                placeholder={t('deck.export.konamiIdPlaceholder')}
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
  onRemove: (cardId: number, zone: DeckZone) => void;
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
                height={87}
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
              −
            </button>
          </div>
        ))}
        {cards.length === 0 && (
          <div className={styles.zoneEmpty}>
            {zone === 'main' ? '🃏' : zone === 'extra' ? '⭐' : '📋'}
          </div>
        )}
      </div>
    </div>
  );
}
