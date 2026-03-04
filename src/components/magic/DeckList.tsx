'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useMagicAuth } from '@/contexts/MagicAuthContext';
import { useMagicLanguage } from '@/contexts/MagicLanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { MagicDeck, DECK_LIMITS } from '@/types/magic';
import styles from './DeckList.module.scss';

export default function DeckList() {
  const { isAuthenticated, isLoading: authLoading } = useMagicAuth();
  const { t } = useMagicLanguage();
  const { showToast } = useToast();
  const router = useRouter();

  const [decks, setDecks] = useState<MagicDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDesc, setNewDeckDesc] = useState('');
  const [newDeckFormat, setNewDeckFormat] = useState('standard');
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDecks = useCallback(async () => {
    try {
      const res = await fetch('/api/magic/decks');
      const data = await res.json();
      setDecks(data.decks || []);
    } catch {
      showToast(t('deck.error.fetch'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  useEffect(() => {
    if (!authLoading) {
      fetchDecks();
    }
  }, [authLoading, fetchDecks]);

  const handleCreate = async () => {
    if (!newDeckName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/magic/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newDeckName,
          description: newDeckDesc,
          format: newDeckFormat,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.message === 'DECK_LIMIT_REACHED') {
          showToast(t('deck.error.limitReached'), 'error');
        } else {
          showToast(t('deck.error.create'), 'error');
        }
        return;
      }

      showToast(t('deck.toast.created'), 'success');
      setShowCreateModal(false);
      setNewDeckName('');
      setNewDeckDesc('');
      setNewDeckFormat('standard');
      router.push(`/magic/decks/${data.deck._id}`);
    } catch {
      showToast(t('deck.error.create'), 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (deckId: string, deckName: string) => {
    if (!confirm(t('deck.confirmDelete'))) return;
    setDeletingId(deckId);
    try {
      const res = await fetch(`/api/magic/decks/${deckId}`, { method: 'DELETE' });
      if (res.ok) {
        setDecks((prev) => prev.filter((d) => d._id !== deckId));
        showToast(`${deckName} ${t('deck.toast.deleted')}`, 'success');
      } else {
        showToast(t('deck.error.delete'), 'error');
      }
    } catch {
      showToast(t('deck.error.delete'), 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const getDeckCardCount = (deck: MagicDeck) => {
    const main = deck.cards.filter((c) => c.zone === 'main').reduce((s, c) => s + c.quantity, 0);
    const sideboard = deck.cards.filter((c) => c.zone === 'sideboard').reduce((s, c) => s + c.quantity, 0);
    return { main, sideboard, total: main + sideboard };
  };

  const getFormatLabel = (format?: string): string => {
    if (!format) return '';
    return format.charAt(0).toUpperCase() + format.slice(1);
  };

  if (loading || authLoading) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner} />
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>&#x1F512;</span>
        <h2 className={styles.emptyTitle}>{t('list.empty.notLoggedIn.title')}</h2>
        <p className={styles.emptyText}>{t('list.empty.notLoggedIn.description')}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('deck.title')}</h1>
        <div className={styles.headerRow}>
          <span className={`${styles.badge} ${styles.brand}`}>
            {decks.length}/{DECK_LIMITS.MAX_DECKS_PER_USER} {t('deck.decksCount')}
          </span>
          {decks.length < DECK_LIMITS.MAX_DECKS_PER_USER && (
            <button
              className={styles.btnCreate}
              onClick={() => setShowCreateModal(true)}
            >
              + {t('deck.createNew')}
            </button>
          )}
        </div>
      </div>

      {decks.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>&#x2694;&#xFE0F;</span>
          <h2 className={styles.emptyTitle}>{t('deck.empty.title')}</h2>
          <p className={styles.emptyText}>{t('deck.empty.description')}</p>
          <button
            className={styles.btnCreate}
            onClick={() => setShowCreateModal(true)}
          >
            + {t('deck.createFirst')}
          </button>
        </div>
      ) : (
        <div className={styles.decksGrid}>
          {decks.map((deck) => {
            const counts = getDeckCardCount(deck);
            return (
              <div
                key={deck._id}
                className={styles.deckCard}
                onClick={() => router.push(`/magic/decks/${deck._id}`)}
              >
                <div className={styles.deckCover}>
                  {deck.coverImage ? (
                    <Image
                      src={deck.coverImage}
                      alt={deck.name}
                      width={120}
                      height={167}
                      className={styles.coverImage}
                    />
                  ) : (
                    <div className={styles.coverPlaceholder}>&#x2694;&#xFE0F;</div>
                  )}
                </div>
                <div className={styles.deckInfo}>
                  <h3 className={styles.deckName}>{deck.name}</h3>
                  {deck.format && (
                    <span className={styles.formatBadge}>{getFormatLabel(deck.format)}</span>
                  )}
                  {deck.description && (
                    <p className={styles.deckDesc}>{deck.description}</p>
                  )}
                  <div className={styles.deckCounts}>
                    <span className={styles.countBadge}>Main: {counts.main}</span>
                    <span className={styles.countBadge}>Sideboard: {counts.sideboard}</span>
                  </div>
                  <div className={styles.deckTotal}>
                    <span className={`${styles.totalBadge} ${counts.main >= DECK_LIMITS.MAIN_MIN ? styles.totalValid : styles.totalInvalid}`}>
                      Main: {counts.main}/{DECK_LIMITS.MAIN_MIN}+
                    </span>
                    <span className={`${styles.totalBadge} ${counts.sideboard <= DECK_LIMITS.SIDEBOARD_MAX ? styles.totalValid : styles.totalInvalid}`}>
                      SB: {counts.sideboard}/{DECK_LIMITS.SIDEBOARD_MAX}
                    </span>
                  </div>
                  <div className={styles.deckDate}>
                    {new Date(deck.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  className={styles.btnDelete}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(deck._id!, deck.name);
                  }}
                  disabled={deletingId === deck._id}
                >
                  {deletingId === deck._id ? '...' : '\u{1F5D1}\uFE0F'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>{t('deck.createNew')}</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('deck.name')}</label>
              <input
                type="text"
                className={styles.formInput}
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
                placeholder="Ej: Azorius Control..."
                maxLength={50}
                autoFocus
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('deck.format')}</label>
              <select
                className={styles.formInput}
                value={newDeckFormat}
                onChange={(e) => setNewDeckFormat(e.target.value)}
              >
                <option value="standard">Standard</option>
                <option value="pioneer">Pioneer</option>
                <option value="modern">Modern</option>
                <option value="legacy">Legacy</option>
                <option value="vintage">Vintage</option>
                <option value="commander">Commander</option>
                <option value="pauper">Pauper</option>
                <option value="historic">Historic</option>
                <option value="alchemy">Alchemy</option>
                <option value="brawl">Brawl</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('deck.description')}</label>
              <textarea
                className={styles.formTextarea}
                value={newDeckDesc}
                onChange={(e) => setNewDeckDesc(e.target.value)}
                placeholder={t('deck.descriptionPlaceholder')}
                maxLength={200}
                rows={3}
              />
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.btnCancel}
                onClick={() => setShowCreateModal(false)}
              >
                {t('common.cancel')}
              </button>
              <button
                className={styles.btnConfirm}
                onClick={handleCreate}
                disabled={creating || !newDeckName.trim()}
              >
                {creating ? t('common.loading') : t('deck.create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
