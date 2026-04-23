import { useEffect, useState } from 'react'
import { deleteHistoryItem, getHistoryItem } from '../services/reviewApi'
const CodeBlock = ({ title, content }) => (
    <section style={{
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        background: '#ffffff',
        padding: '18px',
    }}>
        <h2 style={{ margin: '0 0 12px', fontSize: '18px', color: '#111111' }}>{title}</h2>
        {content ? (
            <pre style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: '14px',
                lineHeight: 1.7,
                color: '#111111',
                maxHeight: '380px',
                overflowY: 'auto',
            }}>
                {content}
            </pre>
        ) : (
            <p style={{ margin: 0, color: '#6b7280' }}>Not generated for this run.</p>
        )}
    </section>
)
const HistoryDetailPage = ({ id, navigate }) => {
    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    useEffect(() => {
        let mounted = true
        const load = async () => {
            try {
                const response = await getHistoryItem(id)
                if (mounted) setItem(response)
            } catch (err) {
                if (mounted) setError(err.message || 'Failed to load history item')
            } finally {
                if (mounted) setLoading(false)
            }
        }
        load()
        return () => {
            mounted = false
        }
    }, [id])
    const handleDelete = async () => {
        try {
            await deleteHistoryItem(id)
            navigate('/history')
        } catch (err) {
            setError(err.message || 'Failed to delete history item')
        }
    }
    return (
        <div style={{ display: 'grid', gap: '18px' }}>
            <section>
                <p style={{ textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6b7280', fontSize: '12px', fontWeight: 700 }}>
                    History detail
                </p>
                <h1 style={{ margin: '8px 0 10px', fontSize: '30px', color: '#111111' }}>
                    {loading ? 'Loading record...' : item?.filename || 'History record'}
                </h1>
                {!loading && item && (
                    <p style={{ margin: 0, color: '#4b5563' }}>
                        UUID: {String(item.id)} | Created: {new Date(item.created_at).toLocaleString()} | Language: {item.language}
                    </p>
                )}
            </section>
            {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
            {loading && <p style={{ color: '#6b7280' }}>Loading history item...</p>}
            {item && (
                <div style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/history')}
                            style={buttonStyle}
                        >
                            Back to History
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            style={secondaryButtonStyle}
                        >
                            Delete Record
                        </button>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '16px',
                    }}>
                        <CodeBlock title="Original Code" content={item.original_code} />
                        <CodeBlock title="Review Output" content={item.review_output} />
                        <CodeBlock title="Refactored Code" content={item.refactored_code} />
                    </div>
                </div>
            )}
        </div>
    )
}
const buttonStyle = {
    border: '1px solid #111111',
    background: '#111111',
    color: '#ffffff',
    padding: '12px 18px',
    borderRadius: '999px',
    fontWeight: 700,
    cursor: 'pointer',
}
const secondaryButtonStyle = {
    border: '1px solid #d1d5db',
    background: '#ffffff',
    color: '#111111',
    padding: '12px 18px',
    borderRadius: '999px',
    fontWeight: 600,
    cursor: 'pointer',
}
export default HistoryDetailPage