'use client';

import { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface RevealFxProps extends HTMLAttributes<HTMLDivElement> {
  translateY?: number | string;
  delay?: number;
  fillWidth?: boolean;
  horizontal?: 'start' | 'center' | 'end';
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
}

export const RevealFx = forwardRef<HTMLDivElement, RevealFxProps>(({
  translateY = 0,
  delay = 0,
  fillWidth,
  horizontal = 'start',
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  className,
  style,
  children,
  ...props
}, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay]);

  const justifyMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
  };

  const computedStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: justifyMap[horizontal],
    width: fillWidth ? '100%' : undefined,
    paddingTop: paddingTop ? `${parseFloat(paddingTop) * 0.25}rem` : undefined,
    paddingBottom: paddingBottom ? `${parseFloat(paddingBottom) * 0.25}rem` : undefined,
    paddingLeft: paddingLeft ? `${parseFloat(paddingLeft) * 0.25}rem` : undefined,
    paddingRight: paddingRight ? `${parseFloat(paddingRight) * 0.25}rem` : undefined,
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? 'translateY(0)'
      : `translateY(${typeof translateY === 'number' ? `${translateY}px` : translateY})`,
    transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
    ...style,
  };

  return (
    <div
      ref={(node) => {
        (elementRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={className}
      style={computedStyle}
      {...props}
    >
      {children}
    </div>
  );
});

RevealFx.displayName = 'RevealFx';

export default RevealFx;
