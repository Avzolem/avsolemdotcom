'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useMagicAuth } from '@/contexts/MagicAuthContext';
import { useMagicLanguage } from '@/contexts/MagicLanguageContext';
import { useToast } from '@/contexts/ToastContext';
import {
  MagicDeck,
  MagicCard,
  CardInDeck,
  DeckZone,
  DECK_LIMITS,
  isBasicLand,
  parseManaSymbols,
  getPrimaryType,
} from '@/types/magic';
import { FORMATS, FORMAT_LABELS } from '@/lib/constants/magic';
import DeckStats from '@/components/magic/DeckStats';
import styles from './DeckBuilder.module.scss';

interface DeckBuilderProps {
  deckId: string;
}

export default function DeckBuilder({ deckId }: DeckBuilderProps) {
  const { isAuthenticated, isLoading: authLoading } = useMagicAuth();
  const { t } = useMagicLanguage();
  const { showToast } = useToast();
  const router = useRouter();

  const [deck, setDeck] = useState<MagicDeck | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [editingDesc, setEditingDesc] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [activeZone, setActiveZone] = useState<DeckZone>('main');

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MagicCard[]>([]);
  const [searching, setSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Export PDF state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPlayerName, setExportPlayerName] = useState('');
  const [exportEventName, setExportEventName] = useState('');
  const [exportEventDate, setExportEventDate] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchDeck = useCallback(async () => {
    try {
      const res = await fetch(`/api/magic/decks/${deckId}`);
      if (!res.ok) {
        router.push('/magic/decks');
        return;
      }
      const data = await res.json();
      setDeck(data.deck);
      setNameInput(data.deck.name);
      setDescInput(data.deck.description || '');
      setSelectedFormat(data.deck.format || '');
    } catch {
      showToast(t('deck.error.fetch'), 'error');
      router.push('/magic/decks');
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
        const res = await fetch(
          `/api/magic/search?q=${encodeURIComponent(searchTerm.trim())}&limit=20`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.data || []);
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

  const handleAddCard = async (card: MagicCard) => {
    if (!deck) return;

    const zone = activeZone;

    const cardData: Omit<CardInDeck, 'quantity' | 'zone'> = {
      cardId: card.id,
      cardName: card.name,
      cardImage: card.images.small || '',
      cardType: card.typeLine,
      subtypes: card.subtypes || [],
      manaCost: card.manaCost,
      cmc: card.cmc,
      colors: card.colors,
      power: card.power,
      toughness: card.toughness,
    };

    // Check copy limits
    if (!isBasicLand(card.name)) {
      const totalCopies = getTotalCopies(card.id);
      if (totalCopies >= DECK_LIMITS.MAX_COPIES) {
        showToast(t('deck.error.MAX_COPIES_EXCEEDED'), 'error');
        return;
      }
    }

    // Check sideboard limit
    if (zone === 'sideboard') {
      const sideboardCount = getZoneCount('sideboard');
      if (sideboardCount >= DECK_LIMITS.SIDEBOARD_MAX) {
        showToast(t('deck.error.SIDEBOARD_FULL'), 'error');
        return;
      }
    }

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
      const res = await fetch(`/api/magic/decks/${deckId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addCard', card: cardData, zone, quantity: 1 }),
      });
      const data = await res.json();

      if (!res.ok) {
        setDeck({ ...deck });
        showToast(data.message || t('deck.error.addCard'), 'error');
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
      const res = await fetch(`/api/magic/decks/${deckId}`, {
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
      await fetch(`/api/magic/decks/${deckId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput.trim() }),
      });
      setDeck({ ...deck, name: nameInput.trim() });
    } catch {
      showToast(t('deck.error.update'), 'error');
    }
  };

  const handleSaveDesc = async () => {
    if (!deck) return;
    setEditingDesc(false);

    try {
      await fetch(`/api/magic/decks/${deckId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: descInput.trim() }),
      });
      setDeck({ ...deck, description: descInput.trim() });
    } catch {
      showToast(t('deck.error.update'), 'error');
    }
  };

  const handleFormatChange = async (newFormat: string) => {
    if (!deck) return;
    setSelectedFormat(newFormat);

    try {
      await fetch(`/api/magic/decks/${deckId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: newFormat }),
      });
      setDeck({ ...deck, format: newFormat });
    } catch {
      showToast(t('deck.error.update'), 'error');
    }
  };

  const handleDeleteDeck = async () => {
    if (!deck || !confirm(t('deck.confirmDelete'))) return;

    try {
      const res = await fetch(`/api/magic/decks/${deckId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(t('deck.toast.deleted'), 'success');
        router.push('/magic/decks');
      } else {
        showToast(t('deck.error.delete'), 'error');
      }
    } catch {
      showToast(t('deck.error.delete'), 'error');
    }
  };

  const getZoneCards = (zone: DeckZone) =>
    deck?.cards.filter((c) => c.zone === zone) || [];

  const getZoneCount = (zone: DeckZone) =>
    getZoneCards(zone).reduce((s, c) => s + c.quantity, 0);

  const getTotalCopies = (cardId: string) =>
    deck?.cards
      .filter((c) => c.cardId === cardId)
      .reduce((s, c) => s + c.quantity, 0) || 0;

  const canAddCard = (card: MagicCard) => {
    if (isBasicLand(card.name)) return true;
    return getTotalCopies(card.id) < DECK_LIMITS.MAX_COPIES;
  };

  const getMaxCopiesLabel = (card: MagicCard) => {
    if (isBasicLand(card.name)) return '\u221E';
    return String(DECK_LIMITS.MAX_COPIES);
  };

  const handleExportPdf = async () => {
    if (!deck || !exportPlayerName.trim()) return;
    setExporting(true);
    try {
      const { exportDeckToPdf } = await import('@/lib/services/magicDeckPdfExport');
      await exportDeckToPdf(deck, {
        playerName: exportPlayerName.trim(),
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

  const mainCount = getZoneCount('main');
  const sideboardCount = getZoneCount('sideboard');
  const mainValid = mainCount >= DECK_LIMITS.MAIN_MIN;

  // Render mana symbols for the card list
  const renderManaSymbols = (manaCost?: string) => {
    if (!manaCost) return null;
    const symbols = parseManaSymbols(manaCost);
    return (
      <span className={styles.miniManaCost}>
        {symbols.map((s, i) => (
          <span key={i} className={styles.miniManaSymbol}>{s}</span>
        ))}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/magic/decks')}>
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
          <div className={styles.headerControls}>
            <select
              className={styles.formatSelect}
              value={selectedFormat}
              onChange={(e) => handleFormatChange(e.target.value)}
            >
              <option value="">{t('deck.selectFormat')}</option>
              {FORMATS.map((f) => (
                <option key={f} value={f}>{FORMAT_LABELS[f]}</option>
              ))}
            </select>
            <span className={`${styles.deckTotal} ${mainValid ? styles.deckTotalValid : styles.deckTotalInvalid}`}>
              {t('deck.main')}: {mainCount}/{DECK_LIMITS.MAIN_MIN}+
            </span>
            <span className={styles.sideboardCount}>
              {t('deck.sideboard')}: {sideboardCount}/{DECK_LIMITS.SIDEBOARD_MAX}
            </span>
            <button
              className={styles.exportBtn}
              onClick={() => setShowExportModal(true)}
            >
              &#x1F4C4; {t('deck.export.pdf')}
            </button>
            <button
              className={styles.deleteBtn}
              onClick={handleDeleteDeck}
            >
              &#x1F5D1;
            </button>
          </div>
        </div>

        {/* Description */}
        <div className={styles.descSection}>
          {editingDesc ? (
            <input
              className={styles.descInput}
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
              onBlur={handleSaveDesc}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveDesc()}
              placeholder={t('deck.descriptionPlaceholder')}
              maxLength={200}
            />
          ) : (
            <p
              className={styles.description}
              onClick={() => setEditingDesc(true)}
            >
              {deck.description || t('deck.descriptionPlaceholder')}
            </p>
          )}
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
              return (
                <div key={card.id} className={styles.searchCard}>
                  <div className={styles.searchCardImage}>
                    <Image
                      src={card.images.small || ''}
                      alt={card.name}
                      width={48}
                      height={67}
                      className={styles.cardThumb}
                      unoptimized
                    />
                  </div>
                  <div className={styles.searchCardInfo}>
                    <span className={styles.searchCardName}>{card.name}</span>
                    <span className={styles.searchCardType}>
                      {card.typeLine}
                    </span>
                    {card.manaCost && (
                      <span className={styles.searchCardMana}>
                        {card.manaCost}
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
                      title={`${t('deck.addTo')} ${activeZone}`}
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
          {/* Zone Tabs */}
          <div className={styles.zoneTabs}>
            <button
              className={`${styles.zoneTab} ${activeZone === 'main' ? styles.zoneTabActive : ''}`}
              onClick={() => setActiveZone('main')}
            >
              {t('deck.main')} ({mainCount})
            </button>
            <button
              className={`${styles.zoneTab} ${activeZone === 'sideboard' ? styles.zoneTabActive : ''}`}
              onClick={() => setActiveZone('sideboard')}
            >
              {t('deck.sideboard')} ({sideboardCount}/{DECK_LIMITS.SIDEBOARD_MAX})
            </button>
          </div>

          {/* Card list for active zone */}
          <div className={styles.cardList}>
            {getZoneCards(activeZone).length === 0 ? (
              <div className={styles.zoneEmpty}>
                <p>{activeZone === 'main' ? t('deck.emptyMain') : t('deck.emptySideboard')}</p>
              </div>
            ) : (
              getZoneCards(activeZone).map((card) => (
                <div key={`${card.cardId}-${card.zone}`} className={styles.deckCardRow}>
                  <div className={styles.deckCardImage}>
                    <Image
                      src={card.cardImage}
                      alt={card.cardName}
                      width={36}
                      height={50}
                      className={styles.deckCardThumb}
                      unoptimized
                    />
                  </div>
                  <span className={styles.deckCardQty}>x{card.quantity}</span>
                  <span className={styles.deckCardName}>{card.cardName}</span>
                  {renderManaSymbols(card.manaCost)}
                  <span className={styles.deckCardType}>
                    {getPrimaryType(card.cardType)}
                  </span>
                  <div className={styles.deckCardActions}>
                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemoveCard(card.cardId, card.zone)}
                    >
                      &#x2212;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
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
