import axios from 'axios'

const API_URL = 'http://localhost:8081/api'

const api = axios.create({
    baseURL: API_URL
})

export const authService = {
    async register(userData) {
        const response = await api.post('/auth/register', userData)
        return response.data
    },

    async login(email, password) {
        const response = await api.post('/auth/login', { email, password })
        return response.data
    },

    async getProfile() {
        const response = await api.get('/auth/profile')
        return response.data
    },

    setAuthToken(token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    removeAuthToken() {
        delete api.defaults.headers.common['Authorization']
    }
}