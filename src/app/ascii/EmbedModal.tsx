'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface Props {
  snippet: string | null;
  onClose: () => void;
  onCopy: () => Promise<void>;
  title?: string;
  description?: string;
  banner?: ReactNode;
  meta?: ReactNode;
}

export default function EmbedModal({
  snippet,
  onClose,
  onCopy,
  title = 'Embed code',
  description = 'Self-contained <pre> — paste anywhere HTML renders.',
  banner,
  meta,
}: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!snippet) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [snippet, onClose]);

  useEffect(() => {
    if (!snippet) setCopied(false);
  }, [snippet]);

  if (!snippet) return null;

  const handleCopy = async () => {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="ascii-embed-backdrop" onClick={onClose}>
      <div className="ascii-embed-modal" onClick={(e) => e.stopPropagation()}>
        <header className="ascii-embed-head">
          <div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
          <button type="button" className="ascii-embed-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        {banner}
        <textarea
          className="ascii-embed-text"
          value={snippet}
          readOnly
          spellCheck={false}
          onFocus={(e) => e.currentTarget.select()}
        />
        <footer className="ascii-embed-foot">
          <span>{meta ?? `${snippet.length.toLocaleString()} chars`}</span>
          <button type="button" className="ascii-embed-copy" onClick={handleCopy}>
            {copied ? 'Copied ✓' : 'Copy snippet'}
          </button>
        </footer>
      </div>
    </div>
  );
}
