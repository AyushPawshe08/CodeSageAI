import { API_BASE_URL, buildJsonHeaders } from './api'
const parseResponse = async (response) => {
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
        throw new Error(payload.detail || payload.message || `HTTP error! status: ${response.status}`)
    }
    return payload
}
export const registerUser = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: buildJsonHeaders(),
        body: JSON.stringify({ email, password }),
    })
    return parseResponse(response)
}
export const verifyUser = async (email, otp) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: buildJsonHeaders(),
        body: JSON.stringify({ email, otp }),
    })
    return parseResponse(response)
}
export const loginUser = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: buildJsonHeaders(),
        body: JSON.stringify({ email, password }),
    })
    return parseResponse(response)
}
export const logoutUser = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: buildJsonHeaders(),
    })
    return parseResponse(response)
}