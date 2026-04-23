import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://codesageai-2.onrender.com/api',
})

const authHeaders = () => {
    const token = localStorage.getItem('codesage-token')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

const toErrorMessage = (error) => {
    return error?.response?.data?.detail || error?.response?.data?.message || error.message || 'Request failed'
}

export const submitReviewCode = async ({ code, language, files, mode }) => {
    const hasFiles = Array.isArray(files) && files.length > 0

    if (hasFiles) {
        const formData = new FormData()
        formData.append('code', code || '')
        formData.append('language', language || '')
        formData.append('mode', mode || 'review')

        for (const file of files) {
            formData.append('files', file)
        }

        try {
            const response = await api.post('/review-code/', formData, {
                headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() },
            })
            return response.data
        } catch (error) {
            throw new Error(toErrorMessage(error))
        }
    }

    try {
        const response = await api.post('/review-code/', {
            code: code || '',
            language: language || '',
            filename: 'manual-input.txt',
            mode: mode || 'review',
        }, {
            headers: authHeaders(),
        })
        return response.data
    } catch (error) {
        throw new Error(toErrorMessage(error))
    }
}

export const getHistory = async () => {
    try {
        const response = await api.get('/history/', { headers: authHeaders() })
        return response.data
    } catch (error) {
        throw new Error(toErrorMessage(error))
    }
}

export const getHistoryItem = async (id) => {
    try {
        const response = await api.get(`/history/${id}`, { headers: authHeaders() })
        return response.data
    } catch (error) {
        throw new Error(toErrorMessage(error))
    }
}

export const deleteHistoryItem = async (id) => {
    try {
        const response = await api.delete(`/history/${id}`, { headers: authHeaders() })
        return response.data
    } catch (error) {
        throw new Error(toErrorMessage(error))
    }
}
