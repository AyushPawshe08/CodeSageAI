import { useState } from 'react'
import { CheckCircle2, Code2, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react'
import { loginUser, registerUser, verifyUser } from '../services/authApi'
import { useAuth } from '../context/AuthContext'
const inputStyle = {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '14px',
    background: '#ffffff',
    color: '#111111',
    padding: '14px 16px',
    fontSize: '14px',
    outline: 'none',
}
const cardStyle = {
    border: '1px solid #e5e7eb',
    borderRadius: '20px',
    background: '#ffffff',
    padding: '22px',
}
const AuthPanel = () => {
    const { login } = useAuth()
    const [mode, setMode] = useState('register')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const resetAlerts = () => {
        setMessage('')
        setError('')
    }
    const handleRegister = async (event) => {
        event.preventDefault()
        resetAlerts()
        setLoading(true)
        try {
            const response = await registerUser(email, password)
            setMessage(response.message || 'OTP sent to your inbox')
            setMode('verify')
        } catch (err) {
            setError(err.message || 'Unable to register right now')
        } finally {
            setLoading(false)
        }
    }
    const handleVerify = async (event) => {
        event.preventDefault()
        resetAlerts()
        setLoading(true)
        try {
            const response = await verifyUser(email, otp)
            setMessage(response.message || 'Verification complete')
            login(response)
        } catch (err) {
            setError(err.message || 'Verification failed')
        } finally {
            setLoading(false)
        }
    }
    const handleLogin = async (event) => {
        event.preventDefault()
        resetAlerts()
        setLoading(true)
        try {
            const response = await loginUser(email, password)
            setMessage(response.message || 'Login successful')
            login(response)
        } catch (err) {
            setError(err.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }
    const renderForm = () => {
        if (mode === 'verify') {
            return (
                <form onSubmit={handleVerify} style={{ display: 'grid', gap: '16px' }}>
                    <div>
                        <p style={eyebrowStyle}>Verify OTP</p>
                        <h2 style={headingStyle}>Check your inbox</h2>
                        <p style={subTextStyle}>
                            We sent a code to <strong>{email}</strong>.
                        </p>
                    </div>
                    <label style={fieldLabelStyle}>
                        One-time code
                        <input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                            placeholder="000000"
                            maxLength={6}
                            style={{ ...inputStyle, letterSpacing: '0.35em', textAlign: 'center' }}
                        />
                    </label>
                    <button type="submit" disabled={loading} style={primaryButtonStyle(loading)}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <button type="button" onClick={() => setMode('register')} style={linkButtonStyle}>
                        Back to registration
                    </button>
                </form>
            )
        }
        if (mode === 'login') {
            return (
                <form onSubmit={handleLogin} style={{ display: 'grid', gap: '16px' }}>
                    <div>
                        <p style={eyebrowStyle}>Welcome back</p>
                        <h2 style={headingStyle}>Log in to continue</h2>
                        <p style={subTextStyle}>Use your email and password to open the review workspace.</p>
                    </div>
                    <label style={fieldLabelStyle}>
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            style={inputStyle}
                        />
                    </label>
                    <label style={fieldLabelStyle}>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Your password"
                            style={inputStyle}
                        />
                    </label>
                    <button type="submit" disabled={loading} style={primaryButtonStyle(loading)}>
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>
                    <button type="button" onClick={() => setMode('register')} style={linkButtonStyle}>
                        New here? Create an account
                    </button>
                </form>
            )
        }
        return (
            <form onSubmit={handleRegister} style={{ display: 'grid', gap: '16px' }}>
                <div>
                    <p style={eyebrowStyle}>Create account</p>
                    <h2 style={headingStyle}>Start your CodeSage journey</h2>
                    <p style={subTextStyle}>Register with email, get an OTP, and enter the review workspace.</p>
                </div>
                <label style={fieldLabelStyle}>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={inputStyle}
                    />
                </label>
                <label style={fieldLabelStyle}>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        style={inputStyle}
                    />
                </label>
                <button type="submit" disabled={loading} style={primaryButtonStyle(loading)}>
                    {loading ? 'Sending code...' : 'Send OTP'}
                </button>
                <button type="button" onClick={() => setMode('login')} style={linkButtonStyle}>
                    Already have an account? Log in
                </button>
            </form>
        )
    }
    return (
        <div style={{
            minHeight: '100vh',
            background: '#ffffff',
            color: '#111111',
            padding: '24px',
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                alignItems: 'stretch',
                minHeight: 'calc(100vh - 48px)',
            }} className="auth-layout">
                <aside style={{
                    ...cardStyle,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '24px',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <div>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 14px',
                            borderRadius: '999px',
                            background: '#111111',
                            color: '#ffffff',
                            marginBottom: '24px',
                        }}>
                            <Sparkles size={16} />
                            <span style={{ fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700 }}>
                                Secure Auth + AI Review
                            </span>
                        </div>
                        <h1 style={{
                            fontSize: 'clamp(36px, 6vw, 62px)',
                            lineHeight: 0.95,
                            letterSpacing: '-0.05em',
                            margin: '0 0 18px',
                            color: '#111111',
                        }}>
                            CodeSage
                            <span style={{ color: '#6b7280' }}> AI</span>
                        </h1>
                        <p style={{
                            maxWidth: '560px',
                            fontSize: '16px',
                            lineHeight: 1.7,
                            color: '#4b5563',
                        }}>
                            Review code, refactor code, and keep every submission in a UUID-backed history list.
                        </p>
                    </div>
                    <div style={{
                        display: 'grid',
                        gap: '12px',
                    }}>
                        {[
                            { icon: ShieldCheck, title: 'Email verification', text: 'Resend delivers the OTP for new users.' },
                            { icon: Code2, title: 'Review and refactor', text: 'The same workspace supports both code actions.' },
                            { icon: LockKeyhole, title: 'Token sessions', text: 'JWT login keeps the session lightweight.' },
                        ].map((item) => (
                            <div key={item.title} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '14px',
                                padding: '16px',
                                borderRadius: '18px',
                                background: '#fafafa',
                                border: '1px solid #e5e7eb',
                            }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '12px',
                                    background: '#111111',
                                    color: '#ffffff',
                                    display: 'grid',
                                    placeItems: 'center',
                                    flexShrink: 0,
                                }}>
                                    <item.icon size={18} />
                                </div>
                                <div>
                                    <h3 style={{ margin: '0 0 4px', fontSize: '15px', color: '#111111' }}>{item.title}</h3>
                                    <p style={{ margin: 0, color: '#4b5563', fontSize: '13px', lineHeight: 1.6 }}>
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
                <section style={{
                    ...cardStyle,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    {message && (
                        <div style={noticeStyle('#ecfdf5', '#16a34a')}>
                            <CheckCircle2 size={16} />
                            <span>{message}</span>
                        </div>
                    )}
                    {error && (
                        <div style={noticeStyle('#fef2f2', '#b91c1c')}>
                            <span>{error}</span>
                        </div>
                    )}
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        padding: '6px',
                        borderRadius: '18px',
                        background: '#fafafa',
                        border: '1px solid #e5e7eb',
                        marginBottom: '22px',
                    }}>
                        {[
                            { key: 'register', label: 'Register' },
                            { key: 'verify', label: 'Verify OTP' },
                            { key: 'login', label: 'Login' },
                        ].map((item) => (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => {
                                    resetAlerts()
                                    setMode(item.key)
                                }}
                                style={{
                                    flex: 1,
                                    padding: '12px 14px',
                                    borderRadius: '14px',
                                    border: 'none',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    background: mode === item.key ? '#111111' : 'transparent',
                                    color: mode === item.key ? '#ffffff' : '#6b7280',
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                    {renderForm()}
                </section>
            </div>
        </div>
    )
}
const eyebrowStyle = {
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: '#6b7280',
    fontSize: '12px',
    fontWeight: 700,
    margin: '0 0 8px',
}
const headingStyle = {
    margin: '0 0 8px',
    fontSize: '28px',
    lineHeight: 1.1,
    color: '#111111',
}
const subTextStyle = {
    margin: 0,
    color: '#4b5563',
    fontSize: '14px',
    lineHeight: 1.6,
}
const fieldLabelStyle = {
    display: 'grid',
    gap: '8px',
    fontSize: '13px',
    color: '#374151',
    fontWeight: 600,
}
const primaryButtonStyle = (loading) => ({
    border: '1px solid #111111',
    background: '#111111',
    color: '#ffffff',
    padding: '14px 18px',
    borderRadius: '14px',
    fontWeight: 700,
    fontSize: '14px',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.72 : 1,
})
const linkButtonStyle = {
    background: 'transparent',
    border: 'none',
    color: '#6b7280',
    fontSize: '14px',
    textAlign: 'center',
    cursor: 'pointer',
}
const noticeStyle = (background, color) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    borderRadius: '16px',
    marginBottom: '18px',
    background,
    color,
    border: '1px solid currentColor',
})
export default AuthPanel