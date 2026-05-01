import { aureliaTemplate } from './aurelia';
import { solarTemplate } from './solar';
import { consoleTemplate } from './console';
import { hyperfluxTemplate } from './hyperflux';
import { dailyPressTemplate } from './dailyPress';
import { verduraTemplate } from './verdura';
import { stellarTemplate } from './stellar';
import { persimmonTemplate } from './persimmon';
import { avsolemTemplate } from './avsolem';
import type { AsciiTemplate } from './types';

export const templates: AsciiTemplate[] = [
  avsolemTemplate,
  aureliaTemplate,
  solarTemplate,
  consoleTemplate,
  hyperfluxTemplate,
  dailyPressTemplate,
  verduraTemplate,
  stellarTemplate,
  persimmonTemplate,
];

export function getTemplate(id: string): AsciiTemplate | undefined {
  return templates.find((t) => t.id === id);
}

export type { AsciiTemplate, TemplateAsciiPreset, TemplateLayout, TemplateTextLayer } from './types';
