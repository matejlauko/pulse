import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import App from './App'
import { demo } from './lib/demo'
import { GlobalStyle } from './styles/global'

import './styles/preflight.css'
import { theme } from './styles/theme'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />

      <App />
    </ThemeProvider>
  </StrictMode>
)

// @ts-expect-error window fn
window.demo = demo
