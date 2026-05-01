'use client';

import Drawer from './Drawer';
import { templates, type AsciiTemplate } from '@/lib/ascii/templates';

interface Props {
  open: boolean;
  current: string;
  onClose: () => void;
  onPick: (t: AsciiTemplate) => void;
}

export default function TemplatesDrawer({ open, current, onClose, onPick }: Props) {
  return (
    <Drawer open={open} title="Templates" onClose={onClose}>
      <div className="ascii-template-grid">
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            className="ascii-template-card"
            data-active={current === t.id}
            onClick={() => { onPick(t); onClose(); }}
          >
            <div
              className="ascii-template-thumb"
              style={{ background: t.layout.bg, color: t.ascii.fgColor }}
            >
              <span className="thumb-eyebrow">{t.category}</span>
              <span
                className="thumb-title"
                style={{ fontFamily: pickThumbFont(t) }}
              >
                {pickThumbWord(t)}
              </span>
            </div>
            <div className="ascii-template-meta">
              <span>{t.name}</span>
              <span className="ascii-template-meta-sub">{t.ascii.dither} · {t.ascii.charset}</span>
            </div>
          </button>
        ))}
      </div>
    </Drawer>
  );
}

function pickThumbFont(t: AsciiTemplate): string {
  if (t.id === 'console-broadcast') return 'var(--font-code), monospace';
  return 'var(--font-aurelia-display), serif';
}

function pickThumbWord(t: AsciiTemplate): string {
  const titleLayer = t.layout.layers.find((l) => l.id === 'title');
  return titleLayer?.text ?? t.name;
}
