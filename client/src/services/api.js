// Production defaults to the deployed backend so the Vercel frontend works out of the box.
// You can still override this with VITE_API_URL in local development or future deployments.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://codesageai-2.onrender.com/api'

export const buildJsonHeaders = () => ({
    'Content-Type': 'application/json',
})

export const buildAuthHeaders = () => {
    const token = localStorage.getItem('codesage-token')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

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
                ...buildJsonHeaders(),
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
            throw new Error('Cannot connect to server. Make sure the backend is reachable at https://codesageai-2.onrender.com')
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
                ...buildJsonHeaders(),
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
            throw new Error('Cannot connect to server. Make sure the backend is reachable at https://codesageai-2.onrender.com')
        }
        throw error
    }
}
