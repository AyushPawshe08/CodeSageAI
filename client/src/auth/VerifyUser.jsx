import { ArrowRight, Mail, ShieldCheck } from 'lucide-react'
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
    letterSpacing: '0.35em',
    textAlign: 'center',
}
const VerifyUser = ({ email, otp, setOtp, onSubmit, onBack, loading, resendHint }) => {
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
                    Verify email
                </p>
                <h2 style={{ fontSize: '28px', lineHeight: 1.1, color: 'var(--text-heading)', marginBottom: '8px' }}>
                    Check your inbox
                </h2>
                <p style={{ color: 'var(--text-body)', fontSize: '14px', lineHeight: 1.6 }}>
                    We sent a six-digit OTP to <strong style={{ color: 'var(--text-heading)' }}>{email}</strong>.
                </p>
            </div>
            <label style={{ display: 'grid', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>One-time code</span>
                <div style={{ position: 'relative' }}>
                    <ShieldCheck size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                        placeholder="000000"
                        maxLength={6}
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
                {loading ? 'Verifying...' : 'Verify OTP'}
                <ArrowRight size={16} />
            </button>
            <button
                type="button"
                onClick={onBack}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                    textAlign: 'center',
                    cursor: 'pointer',
                }}
            >
                Back to registration
            </button>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '14px',
                padding: '12px 14px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-inset)',
                color: 'var(--text-muted)',
                fontSize: '13px',
            }}>
                <Mail size={14} />
                <span>{resendHint}</span>
            </div>
        </form>
    )
}
export default VerifyUser