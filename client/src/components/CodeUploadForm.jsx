import { useMemo, useState } from 'react'
const ACCEPTED_EXTENSIONS = '.py,.js,.jsx,.ts,.tsx,.java,.cpp,.c,.cs,.go,.rs,.txt'
const CodeUploadForm = ({ mode, onSubmit, loading }) => {
    const [code, setCode] = useState('')
    const [language, setLanguage] = useState('JavaScript')
    const [files, setFiles] = useState([])
    const acceptedLabel = useMemo(() => ACCEPTED_EXTENSIONS.replaceAll(',', ', '), [])
    const handleFiles = (event) => {
        setFiles(Array.from(event.target.files || []))
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        await onSubmit({ code, language, files })
    }
    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <div>
                <label style={{ display: 'grid', gap: '8px', marginBottom: '14px' }}>
                    <span style={{ fontWeight: 600 }}>Language</span>
                    <input
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        placeholder="JavaScript"
                        style={{
                            border: '1px solid #d1d5db',
                            padding: '12px 14px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            color: '#111111',
                            background: '#ffffff',
                        }}
                    />
                </label>
                <label style={{ display: 'grid', gap: '8px', marginBottom: '14px' }}>
                    <span style={{ fontWeight: 600 }}>Paste code or upload files</span>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        rows={14}
                        placeholder="Paste your code here..."
                        style={{
                            border: '1px solid #d1d5db',
                            padding: '14px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            lineHeight: 1.6,
                            color: '#111111',
                            background: '#ffffff',
                            resize: 'vertical',
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                        }}
                    />
                </label>
                <label style={{ display: 'grid', gap: '8px' }}>
                    <span style={{ fontWeight: 600 }}>Upload files</span>
                    <input
                        type="file"
                        multiple
                        accept={ACCEPTED_EXTENSIONS}
                        onChange={handleFiles}
                        style={{
                            border: '1px dashed #9ca3af',
                            padding: '12px',
                            borderRadius: '12px',
                            background: '#fafafa',
                        }}
                    />
                    <small style={{ color: '#6b7280' }}>
                        Accepted: {acceptedLabel}. Maximum file size: 2MB.
                    </small>
                </label>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        border: '1px solid #111111',
                        background: '#111111',
                        color: '#ffffff',
                        padding: '12px 18px',
                        borderRadius: '999px',
                        fontWeight: 700,
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'Processing...' : mode === 'review' ? 'Run Review' : 'Run Refactor'}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setCode('')
                        setFiles([])
                    }}
                    style={{
                        border: '1px solid #d1d5db',
                        background: '#ffffff',
                        color: '#111111',
                        padding: '12px 18px',
                        borderRadius: '999px',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    Clear
                </button>
            </div>
            {files.length > 0 && (
                <div style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    background: '#fafafa',
                }}>
                    <div style={{ fontWeight: 700, marginBottom: '8px' }}>Selected files</div>
                    <ul style={{ margin: 0, paddingLeft: '18px' }}>
                        {files.map((file) => (
                            <li key={file.name}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </form>
    )
}
export default CodeUploadForm