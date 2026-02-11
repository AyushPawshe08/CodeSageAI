import { Code2, Sparkles, Wand2 } from 'lucide-react'
import Editor from '@monaco-editor/react'

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
    const currentLanguage = LANGUAGES.find(lang => lang.value === language)

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200">
                <Code2 className="w-5 h-5 text-gray-700" />
                <h2 className="text-base font-semibold text-gray-900">
                    Input Code
                </h2>
            </div>

            {/* Language Selector */}
            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                    Language
                </label>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                    {LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Editor */}
            <div className="border-b border-gray-200">
                <Editor
                    height="420px"
                    language={currentLanguage?.monacoLang || 'javascript'}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-light"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        automaticLayout: true,
                        padding: { top: 12, bottom: 12 },
                    }}
                />
            </div>

            {/* Actions */}
            <div className="px-5 py-4 flex gap-3">
                <button
                    onClick={onReview}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50"
                >
                    <Sparkles className="w-4 h-4" />
                    Review
                </button>

                <button
                    onClick={onRefactor}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 disabled:opacity-50"
                >
                    <Wand2 className="w-4 h-4" />
                    Refactor
                </button>
            </div>
        </div>
    )
}

export default CodeInput
