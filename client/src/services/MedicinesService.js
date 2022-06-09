import Api from '@/services/api'

export default {
    all() {
        return Api().post('/medicines/all')
    },
    getMedicine(medicineId) {
        return Api().post('/medicines/medicine/' + medicineId)
    },
    create(credentials) {
        return Api().post('/medicines/create', credentials)
    },
    edit(credentials) {
        return Api().post('/medicines/edit', credentials)
    },
    import (credentials) {
        return Api().post('/medicines/import', credentials)
    },
    delete(credentials) {
        return Api().post('/medicines/delete', credentials)
    }
}