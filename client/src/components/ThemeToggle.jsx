import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme()

    return (
        <button
            id="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
                position: 'relative',
                width: '52px',
                height: '28px',
                borderRadius: '14px',
                border: 'none',
                background: isDark
                    ? 'linear-gradient(135deg, #1a1b25, #25273a)'
                    : 'linear-gradient(135deg, #e4e7f0, #f4f6fb)',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isDark
                    ? 'inset 0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(145,117,255,0.1)'
                    : 'inset 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
                outline: 'none',
                padding: 0,
                flexShrink: 0,
            }}
        >
            {/* Track Glow */}
            <div style={{
                position: 'absolute',
                inset: '-1px',
                borderRadius: '15px',
                background: isDark ? 'var(--accent)' : 'transparent',
                opacity: isDark ? 0.3 : 0,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none',
            }} />

            {/* Slider Circle */}
            <div style={{
                position: 'absolute',
                top: '3px',
                left: isDark ? '26px' : '3px',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: isDark ? '#9175ff' : '#ffffff',
                boxShadow: isDark
                    ? '0 2px 8px rgba(145,117,255,0.4)'
                    : '0 1px 4px rgba(0,0,0,0.15)',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
            }}>
                {isDark ? (
                    <Moon size={12} color="#fff" strokeWidth={2.5} />
                ) : (
                    <Sun size={12} color="#f59e0b" strokeWidth={2.5} />
                )}
            </div>
        </button>
    )
}

export default ThemeToggle
