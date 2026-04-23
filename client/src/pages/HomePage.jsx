const HomePage = ({ navigate }) => {
    return (
        <div style={{ display: 'grid', gap: '28px' }}>
            <section style={{ maxWidth: '760px' }}>
                <p style={{ textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6b7280', fontSize: '12px', fontWeight: 700 }}>
                    AI code review system
                </p>
                <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1.02, letterSpacing: '-0.06em', margin: '10px 0 16px', color: '#111111' }}>
                    Review, refactor, and track every code submission.
                </h1>
                <p style={{ fontSize: '18px', lineHeight: 1.7, color: '#374151', maxWidth: '680px' }}>
                    Upload code files or paste code directly. CodeSage AI will clean the input, optimize token usage, generate a structured review, and save everything in history.
                </p>
            </section>
            <section style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
            }}>
                {[
                    { title: 'File Upload', text: 'Support for .py, .js, .ts, .java, .cpp, .c, .cs, .go, .rs, and .txt.' },
                    { title: 'Token Optimization', text: 'Large code is chunked safely before sending it to the LLM.' },
                    { title: 'History', text: 'Every review is stored with a UUID and can be revisited anytime.' },
                ].map((card) => (
                    <article key={card.title} style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '16px',
                        background: '#ffffff',
                        padding: '18px',
                    }}>
                        <h2 style={{ margin: '0 0 10px', fontSize: '18px', color: '#111111' }}>{card.title}</h2>
                        <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.6 }}>{card.text}</p>
                    </article>
                ))}
            </section>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/review')} style={ctaStyle}>Start Review</button>
                <button onClick={() => navigate('/history')} style={secondaryStyle}>View History</button>
            </div>
        </div>
    )
}
const ctaStyle = {
    border: '1px solid #111111',
    background: '#111111',
    color: '#ffffff',
    padding: '12px 18px',
    borderRadius: '999px',
    fontWeight: 700,
    cursor: 'pointer',
}
const secondaryStyle = {
    border: '1px solid #d1d5db',
    background: '#ffffff',
    color: '#111111',
    padding: '12px 18px',
    borderRadius: '999px',
    fontWeight: 600,
    cursor: 'pointer',
}
export default HomePage