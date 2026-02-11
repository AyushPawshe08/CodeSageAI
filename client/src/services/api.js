const API_BASE_URL = 'http://127.0.0.1:8000/api'

/**
 * Review code using the AI backend
 * @param {string} code - The code to review
 * @param {string} language - Programming language
 * @returns {Promise<{result: string}>}
 */
export const reviewCode = async (code, language) => {
    try {
        const response = await fetch(`${API_BASE_URL}/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, language }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Cannot connect to server. Make sure the backend is running on http://127.0.0.1:8000')
        }
        throw error
    }
}

/**
 * Refactor code using the AI backend
 * @param {string} code - The code to refactor
 * @param {string} language - Programming language
 * @returns {Promise<{result: string}>}
 */
export const refactorCode = async (code, language) => {
    try {
        const response = await fetch(`${API_BASE_URL}/refactor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, language }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Cannot connect to server. Make sure the backend is running on http://127.0.0.1:8000')
        }
        throw error
    }
}
