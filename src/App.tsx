import { Toaster } from 'sonner'
import Content from './components/content'
import Header from './components/header'

function App() {
  return (
    <>
      <Header />
      <Content />
      <Toaster richColors closeButton />
    </>
  )
}

export default App
