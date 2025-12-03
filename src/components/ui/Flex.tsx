import { forwardRef, HTMLAttributes, ElementType } from 'react';
import { cn } from '@/lib/utils';

type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type FlexJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
type FlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
type FlexWrap = 'wrap' | 'nowrap' | 'wrap-reverse';
type SpacingValue = '0' | '1' | '2' | '4' | '6' | '8' | '10' | '12' | '16' | '20' | '24' | '32' | '40' | '48' | '64' | 'xs' | 's' | 'm' | 'l' | 'xl';

interface FlexProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  direction?: FlexDirection;
  horizontal?: FlexJustify;
  vertical?: FlexAlign;
  wrap?: FlexWrap;
  gap?: SpacingValue;
  padding?: SpacingValue;
  paddingX?: SpacingValue;
  paddingY?: SpacingValue;
  paddingTop?: SpacingValue;
  paddingBottom?: SpacingValue;
  paddingLeft?: SpacingValue;
  paddingRight?: SpacingValue;
  margin?: SpacingValue;
  marginX?: SpacingValue;
  marginY?: SpacingValue;
  marginTop?: SpacingValue;
  marginBottom?: SpacingValue;
  marginLeft?: SpacingValue;
  marginRight?: SpacingValue;
  fillWidth?: boolean;
  fillHeight?: boolean;
  fitWidth?: boolean;
  fitHeight?: boolean;
  minHeight?: SpacingValue | string;
  maxWidth?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'full' | string;
  flex?: number;
  zIndex?: number;
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky' | 'unset';
  background?: string;
  border?: string;
  radius?: string;
  shadow?: string;
  textVariant?: string;
  hide?: 's' | 'm' | 'l';
  show?: 's' | 'm' | 'l';
}

const spacingMap: Record<string, string> = {
  '0': '0',
  '1': '0.25rem',
  '2': '0.5rem',
  '4': '1rem',
  '6': '1.5rem',
  '8': '2rem',
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '32': '8rem',
  '40': '10rem',
  '48': '12rem',
  '64': '16rem',
  'xs': '0.25rem',
  's': '0.5rem',
  'm': '1rem',
  'l': '1.5rem',
  'xl': '2rem',
};

const maxWidthMap: Record<string, string> = {
  'xs': '20rem',
  's': '32rem',
  'm': '48rem',
  'l': '64rem',
  'xl': '80rem',
  'full': '100%',
};

const justifyMap: Record<FlexJustify, string> = {
  'start': 'flex-start',
  'end': 'flex-end',
  'center': 'center',
  'between': 'space-between',
  'around': 'space-around',
  'evenly': 'space-evenly',
};

const alignMap: Record<FlexAlign, string> = {
  'start': 'flex-start',
  'end': 'flex-end',
  'center': 'center',
  'baseline': 'baseline',
  'stretch': 'stretch',
};

export const Flex = forwardRef<HTMLElement, FlexProps>(({
  as: Component = 'div',
  direction = 'row',
  horizontal = 'start',
  vertical = 'stretch',
  wrap,
  gap,
  padding,
  paddingX,
  paddingY,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  margin,
  marginX,
  marginY,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  fillWidth,
  fillHeight,
  fitWidth,
  fitHeight,
  minHeight,
  maxWidth,
  flex,
  zIndex,
  position,
  background,
  border,
  radius,
  shadow,
  className,
  style,
  children,
  ...props
}, ref) => {
  const getSpacing = (value?: SpacingValue) => value ? spacingMap[value] || value : undefined;
  const getMaxWidth = (value?: string) => value ? maxWidthMap[value] || value : undefined;

  const computedStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    justifyContent: justifyMap[horizontal],
    alignItems: alignMap[vertical],
    flexWrap: wrap,
    gap: getSpacing(gap),
    padding: getSpacing(padding),
    paddingLeft: getSpacing(paddingLeft) || getSpacing(paddingX),
    paddingRight: getSpacing(paddingRight) || getSpacing(paddingX),
    paddingTop: getSpacing(paddingTop) || getSpacing(paddingY),
    paddingBottom: getSpacing(paddingBottom) || getSpacing(paddingY),
    margin: getSpacing(margin),
    marginLeft: getSpacing(marginLeft) || getSpacing(marginX),
    marginRight: getSpacing(marginRight) || getSpacing(marginX),
    marginTop: getSpacing(marginTop) || getSpacing(marginY),
    marginBottom: getSpacing(marginBottom) || getSpacing(marginY),
    width: fillWidth ? '100%' : fitWidth ? 'fit-content' : undefined,
    height: fillHeight ? '100%' : fitHeight ? 'fit-content' : undefined,
    minHeight: minHeight ? (spacingMap[minHeight] || minHeight) : undefined,
    maxWidth: getMaxWidth(maxWidth),
    flex: flex,
    zIndex: zIndex,
    position: position === 'unset' ? undefined : position,
    ...style,
  };

  // Clean up undefined values
  Object.keys(computedStyle).forEach(key => {
    if (computedStyle[key as keyof React.CSSProperties] === undefined) {
      delete computedStyle[key as keyof React.CSSProperties];
    }
  });

  return (
    <Component
      ref={ref}
      className={className}
      style={computedStyle}
      {...props}
    >
      {children}
    </Component>
  );
});

Flex.displayName = 'Flex';

// Column is just Flex with direction="column"
export const Column = forwardRef<HTMLElement, FlexProps>((props, ref) => (
  <Flex ref={ref} direction="column" {...props} />
));

Column.displayName = 'Column';

// Row is just Flex with direction="row"
export const Row = forwardRef<HTMLElement, FlexProps>((props, ref) => (
  <Flex ref={ref} direction="row" {...props} />
));

Row.displayName = 'Row';

export default Flex;
