import Api from '@/services/api'

export default {
    all() {
        return Api().post('/patients/all')
    },
    getPatient(patientId) {
        return Api().post('/patients/patient/' + patientId)
    },
    create(credentials) {
        return Api().post('/patients/create', credentials)
    },
    edit(credentials) {
        return Api().post('/patients/edit', credentials)
    },
    delete(credentials) {
        return Api().post('/patients/delete', credentials)
    }
}