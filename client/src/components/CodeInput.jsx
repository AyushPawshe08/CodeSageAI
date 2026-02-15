import { Sparkles, Wand2, ChevronDown, Terminal } from 'lucide-react'
import Editor from '@monaco-editor/react'
import { useTheme } from '../context/ThemeContext'

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript', monacoLang: 'javascript' },
    { value: 'python', label: 'Python', monacoLang: 'python' },
    { value: 'java', label: 'Java', monacoLang: 'java' },
    { value: 'typescript', label: 'TypeScript', monacoLang: 'typescript' },
    { value: 'cpp', label: 'C++', monacoLang: 'cpp' },
    { value: 'csharp', label: 'C#', monacoLang: 'csharp' },
    { value: 'go', label: 'Go', monacoLang: 'go' },
    { value: 'rust', label: 'Rust', monacoLang: 'rust' },
    { value: 'php', label: 'PHP', monacoLang: 'php' },
    { value: 'ruby', label: 'Ruby', monacoLang: 'ruby' },
    { value: 'swift', label: 'Swift', monacoLang: 'swift' },
    { value: 'kotlin', label: 'Kotlin', monacoLang: 'kotlin' },
]

const CodeInput = ({ code, setCode, language, setLanguage, onReview, onRefactor, loading }) => {
    const { isDark } = useTheme()
    const currentLanguage = LANGUAGES.find(lang => lang.value === language)

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
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        },
        title: {
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--text-heading)',
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
        },
        selectWrapper: {
            position: 'relative',
            display: 'inline-flex',
        },
        select: {
            appearance: 'none',
            WebkitAppearance: 'none',
            padding: '6px 30px 6px 10px',
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: 'var(--font-sans)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-surface)',
            color: 'var(--text-heading)',
            cursor: 'pointer',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        },
        chevron: {
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
        },
        editorWrapper: {
            borderBottom: '1px solid var(--border-subtle)',
        },
        actions: {
            display: 'flex',
            gap: '10px',
            padding: '14px 20px',
            background: 'var(--bg-elevated)',
        },
        btnPrimary: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: 'var(--accent)',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: 'var(--font-sans)',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.55 : 1,
            transition: 'all 0.3s ease',
            boxShadow: 'var(--shadow-accent)',
            letterSpacing: '0.02em',
        },
        btnSecondary: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-surface)',
            color: 'var(--text-heading)',
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: 'var(--font-sans)',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.55 : 1,
            transition: 'all 0.3s ease',
            letterSpacing: '0.02em',
        },
    }

    return (
        <div
            className="anim-fadeInUp"
            style={styles.card}
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
                        <Terminal size={14} color="#fff" strokeWidth={2.5} />
                    </div>
                    <span style={styles.title}>Editor</span>
                </div>
                <div style={styles.selectWrapper}>
                    <select
                        id="language-select"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={styles.select}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-focus)'
                            e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow)'
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-default)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={12} style={styles.chevron} />
                </div>
            </div>

            {/* Monaco Editor */}
            <div style={styles.editorWrapper}>
                <Editor
                    height="440px"
                    language={currentLanguage?.monacoLang || 'javascript'}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme={isDark ? 'vs-dark' : 'vs'}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        automaticLayout: true,
                        padding: { top: 16, bottom: 16 },
                        scrollBeyondLastLine: false,
                        renderLineHighlight: 'gutter',
                        cursorBlinking: 'smooth',
                        cursorSmoothCaretAnimation: 'on',
                        smoothScrolling: true,
                        fontFamily: "var(--font-mono)",
                        fontLigatures: true,
                        lineHeight: 22,
                    }}
                />
            </div>

            {/* Action Buttons */}
            <div style={styles.actions}>
                <button
                    id="review-button"
                    onClick={onReview}
                    disabled={loading}
                    style={styles.btnPrimary}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = '0 6px 30px rgba(124, 92, 252, 0.35)'
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-accent)'
                    }}
                >
                    <Sparkles size={15} />
                    Review
                </button>

                <button
                    id="refactor-button"
                    onClick={onRefactor}
                    disabled={loading}
                    style={styles.btnSecondary}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            e.currentTarget.style.borderColor = 'var(--accent)'
                            e.currentTarget.style.background = 'var(--accent-light)'
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-default)'
                        e.currentTarget.style.background = 'var(--bg-surface)'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                    }}
                >
                    <Wand2 size={15} />
                    Refactor
                </button>
            </div>
        </div>
    )
}

export default CodeInput
