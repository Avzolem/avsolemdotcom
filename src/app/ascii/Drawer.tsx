'use client';

import { useEffect } from 'react';

interface DrawerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Drawer({ open, title, onClose, children }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className="ascii-drawer-backdrop"
        data-open={open}
        onClick={onClose}
        aria-hidden
      />
      <aside className="ascii-drawer" data-open={open} aria-hidden={!open}>
        <header className="ascii-drawer-head">
          <span>{title}</span>
          <button type="button" onClick={onClose} aria-label="Close">×</button>
        </header>
        <div className="ascii-drawer-body">{children}</div>
      </aside>
    </>
  );
}
