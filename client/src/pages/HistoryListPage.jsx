import { useEffect, useState } from 'react'
import { getHistory } from '../services/reviewApi'
const HistoryListPage = ({ navigate }) => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    useEffect(() => {
        let mounted = true
        const load = async () => {
            try {
                const response = await getHistory()
                if (mounted) setItems(response)
            } catch (err) {
                if (mounted) setError(err.message || 'Failed to load history')
            } finally {
                if (mounted) setLoading(false)
            }
        }
        load()
        return () => {
            mounted = false
        }
    }, [])
    return (
        <div style={{ display: 'grid', gap: '18px' }}>
            <section>
                <p style={{ textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6b7280', fontSize: '12px', fontWeight: 700 }}>
                    History
                </p>
                <h1 style={{ margin: '8px 0 10px', fontSize: '34px', color: '#111111' }}>
                    Past review records
                </h1>
                <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.7, maxWidth: '700px' }}>
                    Browse previous submissions by UUID, filename, and date. Open any record to inspect the original code, review notes, and refactored result.
                </p>
            </section>
            {loading && <p style={{ color: '#6b7280' }}>Loading history...</p>}
            {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
            {!loading && !error && items.length === 0 && (
                <div style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '16px',
                    background: '#ffffff',
                    padding: '18px',
                }}>
                    No history records yet.
                </div>
            )}
            <div style={{
                display: 'grid',
                gap: '12px',
            }}>
                {items.map((item) => (
                    <button
                        key={String(item.id)}
                        type="button"
                        onClick={() => navigate(`/history/${item.id}`)}
                        style={{
                            textAlign: 'left',
                            border: '1px solid #e5e7eb',
                            borderRadius: '16px',
                            background: '#ffffff',
                            padding: '16px 18px',
                            cursor: 'pointer',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                            <strong style={{ color: '#111111' }}>{String(item.id).slice(0, 8)}...</strong>
                            <span style={{ color: '#6b7280' }}>{new Date(item.created_at).toLocaleString()}</span>
                        </div>
                        <div style={{ marginTop: '8px', color: '#374151' }}>{item.filename}</div>
                    </button>
                ))}
            </div>
        </div>
    )
}
export default HistoryListPage