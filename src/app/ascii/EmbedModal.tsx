'use client';

import { useEffect, useState } from 'react';

interface Props {
  snippet: string | null;
  onClose: () => void;
  onCopy: () => Promise<void>;
}

export default function EmbedModal({ snippet, onClose, onCopy }: Props) {
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
            <h3>Embed code</h3>
            <p>Self-contained &lt;pre&gt; — paste anywhere HTML renders.</p>
          </div>
          <button type="button" className="ascii-embed-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <textarea
          className="ascii-embed-text"
          value={snippet}
          readOnly
          spellCheck={false}
          onFocus={(e) => e.currentTarget.select()}
        />
        <footer className="ascii-embed-foot">
          <span>{snippet.length.toLocaleString()} chars</span>
          <button type="button" className="ascii-embed-copy" onClick={handleCopy}>
            {copied ? 'Copied ✓' : 'Copy snippet'}
          </button>
        </footer>
      </div>
    </div>
  );
}
