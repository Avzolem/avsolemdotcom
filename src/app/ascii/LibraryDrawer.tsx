'use client';

import { useEffect, useState } from 'react';
import Drawer from './Drawer';
import { listCreations, deleteCreation, type SavedCreation } from '@/lib/ascii/storage/db';

interface Props {
  open: boolean;
  onClose: () => void;
  onLoad: (item: SavedCreation) => void;
  refreshKey: number;
}

export default function LibraryDrawer({ open, onClose, onLoad, refreshKey }: Props) {
  const [items, setItems] = useState<SavedCreation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    listCreations()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [open, refreshKey]);

  const remove = async (id: string) => {
    await deleteCreation(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <Drawer open={open} title={`Library (${items.length})`} onClose={onClose}>
      {loading && <p style={{ opacity: 0.6, fontSize: 11 }}>Loading…</p>}
      {!loading && items.length === 0 && (
        <p style={{ opacity: 0.55, fontSize: 11, lineHeight: 1.6 }}>
          No saved creations yet. Hit <strong style={{ color: 'var(--ascii-cream)' }}>Save</strong> in the header to keep your edits in the browser.
        </p>
      )}
      <div className="ascii-template-grid">
        {items.map((item) => (
          <div key={item.id} className="ascii-template-card" data-saved="true">
            <button
              type="button"
              className="ascii-template-thumb-btn"
              onClick={() => { onLoad(item); onClose(); }}
            >
              <img src={item.thumbnail} alt={item.name} />
            </button>
            <div className="ascii-template-meta">
              <span>{item.name}</span>
              <span className="ascii-template-meta-sub">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </div>
            <button
              type="button"
              className="ascii-template-delete"
              onClick={() => remove(item.id)}
              aria-label="Delete"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </Drawer>
  );
}
