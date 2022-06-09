import Api from '@/services/api'

export default {
    register(credentials) {
        return Api().post('/auth/register', credentials)
    },
    login(credentials) {
        return Api().post('/auth/login', credentials)
    },
    forgotPassword(credentials) {
        return Api().post('/auth/forgot-password', credentials)
    },
    resetPassword(credentials) {
        return Api().post('/auth/reset-password', credentials)
    },
}