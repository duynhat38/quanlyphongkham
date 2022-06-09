import Api from '@/services/api'

export default {
    all() {
        return Api().post('/prescriptions/all')
    },
    getPrescriptionsOfPatient(credentials) {
        return Api().post('/prescriptions/getPrescriptionsOfPatient/', credentials)
    },
    getPrescription(prescriptionId) {
        return Api().post('/prescriptions/prescription/' + prescriptionId)
    },
    create(credentials) {
        return Api().post('/prescriptions/create', credentials)
    },
    edit(credentials) {
        return Api().post('/prescriptions/edit', credentials)
    },
    delete(credentials) {
        return Api().post('/prescriptions/delete', credentials)
    }
}