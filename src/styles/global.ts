import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  /* Base styles */
  * {
    border-color: ${({ theme }) => theme.colors.neutral[6]};
    min-height: 0;
    min-width: 0;
  }

  html {
    color-scheme: light;
    color: ${({ theme }) => theme.colors.neutral[12]};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
  }

  body {
    background-color: ${({ theme }) => theme.colors.neutral[1]};
    min-height: 100dvh;
    font-size: ${({ theme }) => theme.text.base};
  }

  #app {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }

  /* Typography */
  h1, h2, h3, h4 {
    text-wrap: balance;
  }

  p {
    text-wrap: pretty;
  }
`
