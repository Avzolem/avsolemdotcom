'use client';

import type { AsciiTemplate } from '@/lib/ascii/templates';

interface OverlayProps {
  template: AsciiTemplate;
  texts: Record<string, string>;
  onTextChange: (id: string, value: string) => void;
}

export default function TemplateOverlay({ template, texts, onTextChange }: OverlayProps) {
  return (
    <div className="ascii-overlay">
      {template.layout.layers.map((layer) => {
        const value = texts[layer.id] ?? layer.text;
        return (
          <div
            key={layer.id}
            className={layer.className}
            style={layer.style}
            contentEditable={layer.editable}
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => {
              if (!layer.editable) return;
              const next = e.currentTarget.innerText.trim();
              if (next !== value) onTextChange(layer.id, next);
            }}
          >
            {value}
          </div>
        );
      })}
    </div>
  );
}
