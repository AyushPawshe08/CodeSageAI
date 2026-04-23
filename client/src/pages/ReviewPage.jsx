import { useState } from 'react'

import CodeUploadForm from '../components/CodeUploadForm'

import ResultPanel from '../components/ResultPanel'

import { getHistoryItem, submitReviewCode } from '../services/reviewApi'

const ReviewPage = ({ navigate }) => {

    const [reviewOutput, setReviewOutput] = useState('')

    const [loading, setLoading] = useState(false)

    const [error, setError] = useState('')

    const [storedId, setStoredId] = useState('')

    const handleSubmit = async ({ code, language, files }) => {

        setLoading(true)

        setError('')

        setStoredId('')

        setReviewOutput('')

        try {

            const response = await submitReviewCode({ code, language, files, mode: 'review' })

            const history = await getHistoryItem(response.id)

            setStoredId(response.id)

            setReviewOutput(history.review_output)

        } catch (err) {

            setError(err.message || 'Failed to process review')

        } finally {

            setLoading(false)

        }

    }

    return (

        <div style={{ display: 'grid', gap: '18px' }}>

            <section>

                <p style={{ textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6b7280', fontSize: '12px', fontWeight: 700 }}>

                    Review

                </p>

                <h1 style={{ margin: '8px 0 10px', fontSize: '34px', color: '#111111' }}>

                    Structured review output

                </h1>

                <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.7, maxWidth: '700px' }}>

                    Upload multiple files or paste a single code block. This page generates the review only, then stores it with a UUID history record.

                </p>

            </section>

            {error && (

                <div style={{

                    border: '1px solid #fecaca',

                    background: '#fef2f2',

                    color: '#991b1b',

                    borderRadius: '14px',

                    padding: '12px 14px',

                }}>

                    {error}

                </div>

            )}

            {storedId && (

                <div style={{

                    border: '1px solid #d1d5db',

                    background: '#fafafa',

                    borderRadius: '14px',

                    padding: '12px 14px',

                    color: '#111111',

                }}>

                    Saved as {storedId}.{" "}

                    <button

                        type="button"

                        onClick={() => navigate(`/history/${storedId}`)}

                        style={{

                            border: 'none',

                            background: 'transparent',

                            color: '#111111',

                            fontWeight: 700,

                            cursor: 'pointer',

                            textDecoration: 'underline',

                            padding: 0,

                        }}

                    >

                        Open history record

                    </button>

                </div>

            )}

            <div style={{

                display: 'grid',

                gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)',

                gap: '18px',

                alignItems: 'start',

            }} className="two-column-grid">

                <section style={{

                    border: '1px solid #e5e7eb',

                    borderRadius: '16px',

                    background: '#ffffff',

                    padding: '18px',

                }}>

                    <CodeUploadForm mode="review" onSubmit={handleSubmit} loading={loading} />

                </section>

                <ResultPanel

                    title="Review output"

                    content={reviewOutput}

                    emptyText={loading ? 'Processing review...' : 'Your review will appear here.'}

                />

            </div>

        </div>

    )

}

export default ReviewPage