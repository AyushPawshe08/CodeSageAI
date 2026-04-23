import { useState } from 'react'
const isCommentLine = (line) => {
    const trimmed = line.trimStart()
    return (
        trimmed.startsWith('//') ||
        trimmed.startsWith('#') ||
        trimmed.startsWith('/*') ||
        trimmed.startsWith('*') ||
        trimmed.startsWith('--') ||
        trimmed.startsWith('<!--')
    )
}
const ResultPanel = ({ title, content, emptyText, showCopy = true }) => {
    const [copied, setCopied] = useState(false)
    const handleCopy = async () => {
        if (!content) return
        await navigator.clipboard.writeText(content)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
    }
    return (
        <section style={{
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            background: '#ffffff',
            padding: '18px',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: '12px',
            }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#111111' }}>{title}</h3>
                {showCopy && content && (
                    <button
                        type="button"
                        onClick={handleCopy}
                        style={{
                            border: '1px solid #d1d5db',
                            background: copied ? '#111111' : '#ffffff',
                            color: copied ? '#ffffff' : '#111111',
                            borderRadius: '999px',
                            padding: '8px 12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                )}
            </div>
            {content ? (
                <pre style={{
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: '14px',
                    lineHeight: 1.7,
                    color: '#111111',
                    maxHeight: '520px',
                    overflowY: 'auto',
                }}>
                    {content.split('\n').map((line, index) => {
                        const highlighted = isCommentLine(line)
                        return (
                            <span
                                key={`${index}-${line.slice(0, 20)}`}
                                style={highlighted ? {
                                    display: 'block',
                                    background: '#f3f4f6',
                                    borderLeft: '3px solid #111111',
                                    padding: '0 10px',
                                    borderRadius: '8px',
                                } : {
                                    display: 'block',
                                }}
                            >
                                {line || '\u00A0'}
                            </span>
                        )
                    })}
                </pre>
            ) : (
                <p style={{ margin: 0, color: '#6b7280' }}>{emptyText}</p>
            )}
        </section>
    )
}
export default ResultPanel