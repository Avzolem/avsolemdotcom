import type { Metadata } from 'next';
import { Playfair_Display, Pinyon_Script, Zen_Dots, Alfa_Slab_One } from 'next/font/google';
import './embed.css';

const aureliaDisplay = Playfair_Display({
  variable: '--font-aurelia-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const antimonyDisplay = Pinyon_Script({
  variable: '--font-antimony-display',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

const ultraviolentaDisplay = Zen_Dots({
  variable: '--font-ultraviolenta-display',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

const yellowstoneDisplay = Alfa_Slab_One({
  variable: '--font-yellowstone-display',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ASCII embed',
  robots: { index: false, follow: false },
};

export default function AsciiEmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${aureliaDisplay.variable} ${antimonyDisplay.variable} ${ultraviolentaDisplay.variable} ${yellowstoneDisplay.variable} ascii-embed-root`}
    >
      {children}
    </div>
  );
}
