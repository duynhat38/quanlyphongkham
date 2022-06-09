import Api from '@/services/api'

export default {
    auth() {
        return Api().post('/users/auth')
    },
    all() {
        return Api().post('/users/all')
    },
    getUser(UserId) {
        return Api().post('/users/account/' + UserId)
    },
    changePassword(credentials) {
        return Api().post('/users/change-password', credentials)
    },
    create(credentials) {
        return Api().post('/users/create', credentials)
    },
    edit(credentials) {
        return Api().post('/users/edit', credentials)
    },
    delete(credentials) {
        return Api().post('/users/delete', credentials)
    },
    getDoctors(credentials) {
        return Api().post('/users/getDoctors', credentials)
    },
    getReceptionists(credentials) {
        return Api().post('/users/getReceptionists', credentials)
    },
    getPharmacists(credentials) {
        return Api().post('/users/getPharmacists', credentials)
    },
}