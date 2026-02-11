import { CheckCircle2, AlertCircle, Loader2, FileCode, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import Editor from '@monaco-editor/react'

const ResultDisplay = ({ result, loading, error, activeTab }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(result)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Detect if result contains code (for refactor tab)
    const isCodeResult = activeTab === 'refactor' && result && !result.includes('**')

    return (
        <div className="border-2 border-black rounded-lg overflow-hidden bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] h-fit lg:sticky lg:top-8">
            {/* Header */}
            <div className="bg-black text-white p-4 border-b-2 border-black">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileCode className="w-5 h-5" />
                        <h2 className="text-lg font-bold tracking-tight uppercase">
                            {activeTab === 'review' ? 'Analysis' : 'Refactored'}
                        </h2>
                    </div>

                    {result && !loading && !error && (
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white text-black border-2 border-white rounded text-xs font-bold uppercase tracking-wider transition-all hover:bg-black hover:text-white hover:border-white"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3 h-3" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-white">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16 space-y-6">
                        <div className="relative">
                            <Loader2 className="w-16 h-16 text-black animate-spin" />
                        </div>
                        <div className="text-center">
                            <p className="text-black text-lg font-bold mb-2">Analyzing Code</p>
                            <div className="flex gap-2 justify-center">
                                <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {error && !loading && (
                    <div className="bg-red-50 border-2 border-red-600 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-red-600 font-bold mb-1 uppercase text-sm">Error</h3>
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {result && !loading && !error && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-green-600 mb-4 pb-4 border-b-2 border-gray-200">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-bold uppercase text-sm tracking-wider">Complete</span>
                        </div>

                        {isCodeResult ? (
                            // Show code in Monaco Editor for refactored code
                            <div className="border-2 border-black rounded-lg overflow-hidden">
                                <Editor
                                    height="500px"
                                    language="javascript"
                                    value={result}
                                    theme="vs-light"
                                    options={{
                                        readOnly: true,
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        lineNumbers: 'on',
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        wordWrap: 'on',
                                        padding: { top: 16, bottom: 16 },
                                    }}
                                />
                            </div>
                        ) : (
                            // Show formatted text for reviews
                            <div className="border-2 border-black rounded-lg p-6 max-h-[600px] overflow-y-auto bg-gray-50">
                                <pre className="text-black text-sm leading-relaxed whitespace-pre-wrap font-mono">
                                    {result}
                                </pre>
                            </div>
                        )}
                    </div>
                )}

                {!result && !loading && !error && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 border-2 border-black rounded-lg flex items-center justify-center mb-6">
                            <FileCode className="w-10 h-10 text-black" />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2 uppercase tracking-tight">
                            Ready to Analyze
                        </h3>
                        <p className="text-gray-600 max-w-md">
                            Enter your code and click Review or Refactor to get AI-powered insights
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResultDisplay
