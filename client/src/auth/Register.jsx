import { ArrowRight, Mail, Lock } from 'lucide-react'
const inputStyle = {
    width: '100%',
    border: '1px solid var(--border-default)',
    borderRadius: '14px',
    background: 'var(--bg-elevated)',
    color: 'var(--text-heading)',
    padding: '14px 16px 14px 44px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
}
const Register = ({ email, password, setEmail, setPassword, onSubmit, onSwitchMode, loading }) => {
    return (
        <form
            onSubmit={onSubmit}
            style={{
                display: 'grid',
                gap: '16px',
            }}
        >
            <div>
                <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Create account
                </p>
                <h2 style={{ fontSize: '28px', lineHeight: 1.1, color: 'var(--text-heading)', marginBottom: '8px' }}>
                    Start your CodeSage journey
                </h2>
                <p style={{ color: 'var(--text-body)', fontSize: '14px', lineHeight: 1.6 }}>
                    Register with your email, receive a one-time code, and unlock the reviewer.
                </p>
            </div>
            <label style={{ display: 'grid', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Email</span>
                <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={inputStyle}
                    />
                </div>
            </label>
            <label style={{ display: 'grid', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Password</span>
                <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        style={inputStyle}
                    />
                </div>
            </label>
            <button
                type="submit"
                disabled={loading}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    border: 'none',
                    borderRadius: '14px',
                    background: 'var(--accent)',
                    color: '#fff',
                    padding: '14px 18px',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    boxShadow: 'var(--shadow-accent)',
                }}
            >
                {loading ? 'Sending code...' : 'Send OTP'}
                <ArrowRight size={16} />
            </button>
            <button
                type="button"
                onClick={onSwitchMode}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                    textAlign: 'center',
                    cursor: 'pointer',
                }}
            >
                Already have an account? Log in
            </button>
        </form>
    )
}
export default Register