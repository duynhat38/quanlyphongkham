import Api from '@/services/api'

export default {
    all() {
        return Api().post('/services/all')
    },
    getService(serviceId) {
        return Api().post('/services/service/' + serviceId)
    },
    create(credentials) {
        return Api().post('/services/create', credentials)
    },
    edit(credentials) {
        return Api().post('/services/edit', credentials)
    },
    delete(credentials) {
        return Api().post('/services/delete', credentials)
    }
}