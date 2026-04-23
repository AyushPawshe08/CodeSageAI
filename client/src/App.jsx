import CodeReviewer from './components/CodeReviewer'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <CodeReviewer />
    </ThemeProvider>
  )
}

export default App
