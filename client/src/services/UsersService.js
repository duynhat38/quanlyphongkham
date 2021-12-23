import Api from '@/services/api'

export default {
    index() {
        return Api().post('/users/')
    },
    changePassword(credentials) {
        return Api().post('/users/change-password', credentials)
    },
}