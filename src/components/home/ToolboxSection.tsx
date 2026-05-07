import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getIcon } from '@/lib/icons';
import type { ToolboxItem } from '@/lib/mongodb/models/ToolboxItem';

interface ToolboxSectionProps {
  items: ToolboxItem[];
}

export function ToolboxSection({ items }: ToolboxSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-10 md:mt-12">
      <div className="flex items-center gap-2 mb-4 md:mb-5 text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
        <span className="h-px w-6 bg-gray-300 dark:bg-gray-700" />
        Toolbox
      </div>

      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2 md:gap-2.5">
        {items.map((item) => {
          const Icon = getIcon(item.icon);
          const id = typeof item._id === 'string' ? item._id : item._id?.toString() || item.href;

          const cardClasses = `
            group relative flex flex-col items-center justify-center gap-1
            aspect-square min-h-[60px] p-2 rounded-xl
            bg-white/50 dark:bg-white/[0.03]
            border border-white/60 dark:border-white/[0.08]
            backdrop-blur-xl backdrop-saturate-150
            shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]
            dark:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]
            transition-all duration-300
            hover:-translate-y-0.5 hover:border-cyan-500/60 dark:hover:border-cyan-400/50
            text-gray-700 dark:text-gray-300 hover:text-cyan-700 dark:hover:text-cyan-300
          `;

          const content = (
            <>
              {item.isExternal && (
                <ArrowUpRight className="absolute top-1 right-1 w-2.5 h-2.5 opacity-40 group-hover:opacity-80 transition-opacity" />
              )}
              <Icon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[0.6rem] md:text-[0.65rem] font-medium text-center leading-tight">
                {item.name}
              </span>
            </>
          );

          if (item.isExternal) {
            return (
              <a
                key={id}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={cardClasses}
                title={item.name}
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={id} href={item.href} className={cardClasses} title={item.name}>
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
