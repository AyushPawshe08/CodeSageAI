import { useState } from 'react'
import CodeInput from './CodeInput'
import ResultDisplay from './ResultDisplay'
import { reviewCode, refactorCode } from '../services/api'

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
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <header className="mb-12">
                    <div className="border-b-2 border-black pb-6">
                        <h1 className="text-5xl md:text-6xl font-bold text-black mb-2 tracking-tight">
                            AI Code Reviewer
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Professional code analysis powered by AI
                        </p>
                    </div>
                </header>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Panel - Code Input */}
                    <CodeInput
                        code={code}
                        setCode={setCode}
                        language={language}
                        setLanguage={setLanguage}
                        onReview={() => handleSubmit('review')}
                        onRefactor={() => handleSubmit('refactor')}
                        loading={loading}
                    />

                    {/* Right Panel - Results */}
                    <ResultDisplay
                        result={result}
                        loading={loading}
                        error={error}
                        activeTab={activeTab}
                    />
                </div>

                {/* Footer */}
                <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
                    <p className="text-gray-500 text-sm">
                        Built with FastAPI, React, and Groq AI
                    </p>
                </footer>
            </div>
        </div>
    )
}

export default CodeReviewer
