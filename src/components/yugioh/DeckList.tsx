'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useYugiohAuth } from '@/contexts/YugiohAuthContext';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { YugiohDeck, DECK_LIMITS } from '@/types/yugioh';
import styles from './DeckList.module.scss';

export default function DeckList() {
  const { isAuthenticated, isLoading: authLoading } = useYugiohAuth();
  const { t } = useYugiohLanguage();
  const { showToast } = useToast();
  const router = useRouter();

  const [decks, setDecks] = useState<YugiohDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDesc, setNewDeckDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDecks = useCallback(async () => {
    try {
      const res = await fetch('/api/yugioh/decks');
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
      const res = await fetch('/api/yugioh/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDeckName, description: newDeckDesc }),
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
      router.push(`/yugioh/decks/${data.deck._id}`);
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
      const res = await fetch(`/api/yugioh/decks/${deckId}`, { method: 'DELETE' });
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

  const getDeckCardCount = (deck: YugiohDeck) => {
    const main = deck.cards.filter((c) => c.zone === 'main').reduce((s, c) => s + c.quantity, 0);
    const extra = deck.cards.filter((c) => c.zone === 'extra').reduce((s, c) => s + c.quantity, 0);
    const side = deck.cards.filter((c) => c.zone === 'side').reduce((s, c) => s + c.quantity, 0);
    return { main, extra, side };
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
        <span className={styles.emptyIcon}>🔒</span>
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
          <span className={styles.emptyIcon}>🃏</span>
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
                onClick={() => router.push(`/yugioh/decks/${deck._id}`)}
              >
                <div className={styles.deckCover}>
                  {deck.coverImage ? (
                    <Image
                      src={deck.coverImage}
                      alt={deck.name}
                      width={120}
                      height={175}
                      className={styles.coverImage}
                    />
                  ) : (
                    <div className={styles.coverPlaceholder}>🃏</div>
                  )}
                </div>
                <div className={styles.deckInfo}>
                  <h3 className={styles.deckName}>{deck.name}</h3>
                  {deck.description && (
                    <p className={styles.deckDesc}>{deck.description}</p>
                  )}
                  <div className={styles.deckCounts}>
                    <span className={styles.countBadge}>Main: {counts.main}</span>
                    <span className={styles.countBadge}>Extra: {counts.extra}</span>
                    <span className={styles.countBadge}>Side: {counts.side}</span>
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
                  {deletingId === deck._id ? '...' : '🗑️'}
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
                placeholder={t('deck.namePlaceholder')}
                maxLength={50}
                autoFocus
              />
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
