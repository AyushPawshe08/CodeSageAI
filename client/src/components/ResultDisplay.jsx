import { CheckCircle2, AlertCircle, Loader2, Copy, Check, Zap, FileSearch } from 'lucide-react'
import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { useTheme } from '../context/ThemeContext'

const ResultDisplay = ({ result, loading, error, activeTab }) => {
  const [copied, setCopied] = useState(false)
  const { isDark } = useTheme()

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isCodeResult = activeTab === 'refactor' && result && !result.includes('**')

  const styles = {
    card: {
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
      transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 20px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-elevated)',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    iconWrapper: {
      width: '30px',
      height: '30px',
      borderRadius: 'var(--radius-sm)',
      background: activeTab === 'review' ? '#22c55e' : '#f59e0b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.3s ease',
      flexShrink: 0,
    },
    title: {
      fontSize: '13px',
      fontWeight: 700,
      color: 'var(--text-heading)',
      letterSpacing: '-0.01em',
      textTransform: 'uppercase',
    },
    copyBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      padding: '5px 10px',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border-default)',
      background: copied ? 'var(--success)' : 'var(--bg-surface)',
      color: copied ? '#fff' : 'var(--text-muted)',
      fontSize: '11px',
      fontWeight: 600,
      fontFamily: 'var(--font-sans)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    content: {
      padding: '24px 20px',
      minHeight: '200px',
    },
  }

  return (
    <div
      className="anim-fadeInUp"
      style={{ ...styles.card, animationDelay: '0.1s' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
        e.currentTarget.style.borderColor = 'var(--border-focus)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
        e.currentTarget.style.borderColor = 'var(--border-default)'
      }}
    >
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconWrapper}>
            <FileSearch size={14} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={styles.title}>
            {activeTab === 'review' ? 'Analysis' : 'Refactored'}
          </span>
        </div>
        {result && !loading && !error && (
          <button
            id="copy-button"
            onClick={handleCopy}
            style={styles.copyBtn}
            onMouseEnter={(e) => {
              if (!copied) {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.color = 'var(--text-heading)'
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                e.currentTarget.style.borderColor = 'var(--border-default)'
                e.currentTarget.style.color = 'var(--text-muted)'
              }
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>

      {/* Content */}
      <div style={styles.content}>

        {/* ── Loading ── */}
        {loading && (
          <div className="anim-fadeIn" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '56px 0',
            gap: '18px',
          }}>
            {/* Spinner */}
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '3px solid var(--border-default)',
                borderTopColor: 'var(--accent)',
                animation: 'spinSlow 0.8s linear infinite',
              }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--text-heading)',
                marginBottom: '4px',
              }}>
                {activeTab === 'review' ? 'Analyzing code...' : 'Refactoring code...'}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                This usually takes a few seconds
              </p>
            </div>
            {/* Dot pulse */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  animation: `dotPulse 1.2s ease-in-out ${i * 0.15}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div className="anim-scaleIn" style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--error-bg)',
            border: '1px solid var(--error-border)',
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <AlertCircle size={18} style={{ color: 'var(--error)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--error)',
                  marginBottom: '4px',
                }}>Error</p>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-body)',
                  lineHeight: 1.6,
                }}>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Result ── */}
        {result && !loading && !error && (
          <div className="anim-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--success-bg)',
              width: 'fit-content',
            }}>
              <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />
              <span style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--success)',
              }}>Complete</span>
            </div>

            {isCodeResult ? (
              <div style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--border-default)',
              }}>
                <Editor
                  height="480px"
                  language="javascript"
                  value={result}
                  theme={isDark ? 'vs-dark' : 'vs'}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    padding: { top: 16, bottom: 16 },
                    renderLineHighlight: 'none',
                    fontFamily: "var(--font-mono)",
                    fontLigatures: true,
                    lineHeight: 22,
                  }}
                />
              </div>
            ) : (
              <div style={{
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                maxHeight: '560px',
                overflowY: 'auto',
                background: 'var(--bg-inset)',
                border: '1px solid var(--border-subtle)',
              }}>
                <pre style={{
                  fontSize: '13.5px',
                  lineHeight: 1.75,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--text-body)',
                  margin: 0,
                }}>
                  {result}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* ── Empty State ── */}
        {!result && !loading && !error && (
          <div className="anim-fadeIn" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '56px 20px',
            textAlign: 'center',
          }}>
            <div className="anim-float" style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--accent-light)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px',
            }}>
              <Zap size={28} style={{ color: 'var(--accent)' }} />
            </div>
            <h3 style={{
              fontSize: '17px',
              fontWeight: 800,
              color: 'var(--text-heading)',
              marginBottom: '6px',
              letterSpacing: '-0.02em',
            }}>
              Ready to Analyze
            </h3>
            <p style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              maxWidth: '260px',
              lineHeight: 1.6,
            }}>
              Write or paste your code, then hit <strong style={{ color: 'var(--accent)', fontWeight: 700 }}>Review</strong> or <strong style={{ color: 'var(--accent)', fontWeight: 700 }}>Refactor</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultDisplay
