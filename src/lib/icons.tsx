import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Gamepad2,
  Layers,
  Save,
  Cloud,
  Type,
  Music,
  Video,
  Image as ImageIcon,
  FileText,
  Folder,
  Globe,
  Link as LinkIcon,
  Sparkles,
  Star,
  Heart,
  Wrench,
  Rocket,
  Terminal,
  Code,
  PenTool,
  Camera,
  Map,
  Calendar,
  ShoppingBag,
  Coffee,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { GiDevilMask } from 'react-icons/gi';

const DragonIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c-2 0-4 1-5 3-1-1-3-1-4 0s-1 3 0 4c-2 1-3 3-3 5 0 3 2 5 5 6l2 2c1 1 2 2 5 2s4-1 5-2l2-2c3-1 5-3 5-6 0-2-1-4-3-5 1-1 1-3 0-4s-3-1-4 0c-1-2-3-3-5-3z" />
    <circle cx="9" cy="10" r="1" />
    <circle cx="15" cy="10" r="1" />
    <path d="M9 14c.5.5 1.5 1 3 1s2.5-.5 3-1" />
  </svg>
);

type IconComponent = LucideIcon | React.ComponentType<{ className?: string }>;

export const ICONS: Record<string, IconComponent> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  email: Mail,
  mail: Mail,
  gamepad: Gamepad2,
  cards: Layers,
  dragon: DragonIcon,
  save: Save,
  diablo: GiDevilMask,
  cloud: Cloud,
  type: Type,
  music: Music,
  video: Video,
  image: ImageIcon,
  file: FileText,
  folder: Folder,
  globe: Globe,
  link: LinkIcon,
  sparkles: Sparkles,
  star: Star,
  heart: Heart,
  wrench: Wrench,
  rocket: Rocket,
  terminal: Terminal,
  code: Code,
  pen: PenTool,
  camera: Camera,
  map: Map,
  calendar: Calendar,
  shop: ShoppingBag,
  coffee: Coffee,
  zap: Zap,
};

export const ICON_KEYS = Object.keys(ICONS).sort();

export function getIcon(name: string): IconComponent {
  return ICONS[name.toLowerCase()] || LinkIcon;
}
