import '@radix-ui/colors/black-alpha.css'
import '@radix-ui/colors/blue.css'
import '@radix-ui/colors/green.css'
import '@radix-ui/colors/orange.css'
import '@radix-ui/colors/purple.css'
import '@radix-ui/colors/red.css'
import '@radix-ui/colors/slate-alpha.css'
import '@radix-ui/colors/slate.css'
import '@radix-ui/colors/white-alpha.css'
import '@radix-ui/colors/yellow.css'

type ColorPalette<C extends string> = {
  [K in 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12]: `var(--${C}-${K})`
}

const makeColorPalette = <C extends string>(color: C, alpha: boolean = false): ColorPalette<C> =>
  Object.fromEntries(
    Array(12)
      .fill(1)
      .map((_, i) => [i + 1, `var(--${color}-${alpha ? 'a' : ''}${i + 1})`])
  ) as ColorPalette<C>

export const theme = {
  colors: {
    blackAlpha: makeColorPalette('black', true),
    whiteAlpha: makeColorPalette('white', true),
    neutral: makeColorPalette('slate'),
    red: makeColorPalette('red'),
    blue: makeColorPalette('blue'),
    green: makeColorPalette('green'),
    orange: makeColorPalette('orange'),
    yellow: makeColorPalette('yellow'),
    purple: makeColorPalette('purple'),
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
  },
  text: {
    sm: '0.75rem',
    base: '0.875rem',
    lg: '1rem',
    xl: '1.125rem',
    '2xl': '1.25rem',
    '3xl': '1.5rem',
  },
  borderRadius: {
    base: '8px',
    sm: '6px',
  },
}

export type Theme = typeof theme
