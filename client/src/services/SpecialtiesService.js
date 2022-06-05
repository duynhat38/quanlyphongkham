import Api from '@/services/api'

export default {
    all() {
        return Api().post('/specialties/all')
    },
    getSpecialty(specialtyId) {
        return Api().post('/specialties/specialty/' + specialtyId)
    },
    create(credentials) {
        return Api().post('/specialties/create', credentials)
    },
    edit(credentials) {
        return Api().post('/specialties/edit', credentials)
    },
    delete(credentials) {
        return Api().post('/specialties/delete', credentials)
    },
    findSpecialtyByDoctor(credentials) {
        return Api().post('/specialties/findSpecialtyByDoctor', credentials)
    }
}