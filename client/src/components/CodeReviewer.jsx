import { useState } from 'react'
import CodeInput from './CodeInput'
import ResultDisplay from './ResultDisplay'
import ThemeToggle from './ThemeToggle'
import { reviewCode, refactorCode } from '../services/api'
import { Braces, Github } from 'lucide-react'

const CodeReviewer = () => {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('review')

  const handleSubmit = async (action) => {
    if (!code.trim()) {
      setError('Please enter some code to analyze')
      return
    }
    setLoading(true)
    setError('')
    setResult('')
    try {
      const response = action === 'review'
        ? await reviewCode(code, language)
        : await refactorCode(code, language)
      setResult(response.result)
      setActiveTab(action)
    } catch (err) {
      setError(err.message || 'An error occurred while processing your request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      transition: 'background 0.35s ease',
      position: 'relative',
    }}>
      {/* ── Ambient Background ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}>
        {/* Top-right blob */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          right: '-8%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }} />
        {/* Bottom-left blob */}
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-12%',
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224, 64, 251, 0.05) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }} />
        {/* Center subtle grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(var(--border-subtle) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          opacity: 0.5,
        }} />
      </div>

      {/* ── Page Content ── */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1380px',
        margin: '0 auto',
        padding: '20px 24px 48px',
      }}>

        {/* ═══ Navbar ═══ */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 18px',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-overlay)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-xs)',
          marginBottom: '36px',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-accent)',
            }}>
              <Braces size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <h1 style={{
                fontSize: '16px',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: 'var(--text-heading)',
              }}>
                CodeSage<span style={{ color: 'var(--accent)' }}> AI</span>
              </h1>
              <p style={{
                fontSize: '10px',
                color: 'var(--text-faint)',
                fontWeight: 500,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                Code Intelligence
              </p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href="https://github.com/AyushPawshe08/CodeSageAI"
              target="_blank"
              rel="noopener noreferrer"
              id="github-link"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.color = 'var(--text-heading)'
                e.currentTarget.style.background = 'var(--accent-light)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)'
                e.currentTarget.style.color = 'var(--text-muted)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <Github size={17} />
            </a>
            <ThemeToggle />
          </div>
        </nav>

        {/* ═══ Hero ═══ */}
        <header className="anim-fadeInUp" style={{
          textAlign: 'center',
          marginBottom: '44px',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          {/* Status Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '5px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-light)',
            border: '1px solid var(--border-default)',
            marginBottom: '18px',
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--success)',
              boxShadow: '0 0 6px var(--success)',
            }} />
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--accent)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              AI-Powered
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(26px, 4vw, 40px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.15,
            marginBottom: '12px',
            color: 'var(--text-heading)',
          }}>
            Smarter Code,{' '}
            <span style={{
              color: 'var(--accent)',
            }}>
              Instantly
            </span>
          </h2>
          <p style={{
            fontSize: '15px',
            color: 'var(--text-muted)',
            lineHeight: 1.65,
            maxWidth: '440px',
            margin: '0 auto',
          }}>
            Paste your code and get instant AI-powered reviews, optimizations, and refactoring suggestions.
          </p>
        </header>

        {/* ═══ Main Grid ═══ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '24px',
        }}>
          <style>{`
                        @media (min-width: 1024px) {
                            .main-grid {
                                grid-template-columns: 1fr 1fr !important;
                            }
                        }
                    `}</style>
          <div className="main-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '24px',
            alignItems: 'start',
          }}>
            <CodeInput
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              onReview={() => handleSubmit('review')}
              onRefactor={() => handleSubmit('refactor')}
              loading={loading}
            />
            <ResultDisplay
              result={result}
              loading={loading}
              error={error}
              activeTab={activeTab}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default CodeReviewer
