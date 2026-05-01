import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import './ascii.css';

const aureliaDisplay = Playfair_Display({
  variable: '--font-aurelia-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ASCII Studio · avsolem',
  description: 'Convert images into ASCII typography compositions. Apply editorial templates, animate, export to GIF, PNG, SVG and HTML.',
};

export default function AsciiLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${aureliaDisplay.variable} ascii-shell`}>{children}</div>;
}
