import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ReviewPage from './pages/ReviewPage'
import RefactorPage from './pages/RefactorPage'
import HistoryListPage from './pages/HistoryListPage'
import HistoryDetailPage from './pages/HistoryDetailPage'
import AuthPanel from './auth/AuthPanel'
import { AuthProvider, useAuth } from './context/AuthContext'
const getCurrentPath = () => window.location.pathname || '/'
const AppShell = () => {
    const { isAuthenticated } = useAuth()
    const [path, setPath] = useState(getCurrentPath)
    useEffect(() => {
        const onPopState = () => setPath(getCurrentPath())
        window.addEventListener('popstate', onPopState)
        return () => window.removeEventListener('popstate', onPopState)
    }, [])
    const navigate = (nextPath) => {
        if (nextPath === path) return
        window.history.pushState({}, '', nextPath)
        setPath(nextPath)
    }
    useEffect(() => {
        if (!isAuthenticated) {
            if (path !== '/') {
                navigate('/')
            }
        }
    }, [isAuthenticated, path])
    const renderPage = () => {
        if (!isAuthenticated) {
            return <AuthPanel />
        }
        if (path === '/' || path === '') {
            return <HomePage navigate={navigate} />
        }
        if (path === '/review') {
            return <ReviewPage navigate={navigate} />
        }
        if (path === '/refactor') {
            return <RefactorPage navigate={navigate} />
        }
        if (path === '/history') {
            return <HistoryListPage navigate={navigate} />
        }
        const historyMatch = path.match(/^\/history\/([^/]+)$/)
        if (historyMatch) {
            return <HistoryDetailPage id={historyMatch[1]} navigate={navigate} />
        }
        return (
            <div style={{ padding: '24px 0' }}>
                <h1 style={{ color: '#111111' }}>Page not found</h1>
                <button type="button" onClick={() => navigate('/')} style={{
                    marginTop: '12px',
                    border: '1px solid #111111',
                    background: '#111111',
                    color: '#ffffff',
                    padding: '12px 18px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    cursor: 'pointer',
                }}>
                    Go Home
                </button>
            </div>
        )
    }
    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', color: '#111111' }}>
            {isAuthenticated && <Navbar path={path} navigate={navigate} />}
            <main style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '28px 20px 48px',
            }}>
                {renderPage()}
            </main>
        </div>
    )
}
function App() {
    return (
        <AuthProvider>
            <AppShell />
        </AuthProvider>
    )
}
export default App