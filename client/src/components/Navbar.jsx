import { useAuth } from '../context/AuthContext'
const linkStyle = (active) => ({
    color: '#111111',
    textDecoration: 'none',
    fontWeight: active ? 700 : 500,
    borderBottom: active ? '2px solid #111111' : '2px solid transparent',
    paddingBottom: '4px',
})
const Navbar = ({ path, navigate }) => {
    const { user, logout } = useAuth()
    const isActive = (segment) => path === segment || path.startsWith(`${segment}/`)
    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: 'rgba(255,255,255,0.94)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid #e5e7eb',
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '24px',
            }}>
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#111111',
                        fontSize: '18px',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        cursor: 'pointer',
                    }}
                >
                    CodeSage AI
                </button>
                <nav style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '18px',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                }}>
                    <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={linkStyle(isActive('/'))}>Home</a>
                    <a href="/review" onClick={(e) => { e.preventDefault(); navigate('/review'); }} style={linkStyle(isActive('/review'))}>Review</a>
                    <a href="/refactor" onClick={(e) => { e.preventDefault(); navigate('/refactor'); }} style={linkStyle(isActive('/refactor'))}>Refactor</a>
                    <a href="/history" onClick={(e) => { e.preventDefault(); navigate('/history'); }} style={linkStyle(isActive('/history'))}>History</a>
                    {user && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginLeft: '12px',
                            paddingLeft: '16px',
                            borderLeft: '1px solid #e5e7eb',
                        }}>
                            <div style={{ display: 'grid', textAlign: 'right' }}>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#111111' }}>
                                    {user.email}
                                </span>
                                <span style={{ fontSize: '11px', color: '#6b7280' }}>Signed in</span>
                            </div>
                            <button
                                type="button"
                                onClick={logout}
                                style={{
                                    border: '1px solid #111111',
                                    background: '#111111',
                                    color: '#ffffff',
                                    padding: '10px 14px',
                                    borderRadius: '999px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}
export default Navbar