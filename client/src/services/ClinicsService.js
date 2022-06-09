import Api from '@/services/api'

export default {
    all() {
        return Api().post('/clinics/all')
    },
    getClinic(clinicId) {
        return Api().post('/clinics/clinic/' + clinicId)
    },
    create(credentials) {
        return Api().post('/clinics/create', credentials)
    },
    edit(credentials) {
        return Api().post('/clinics/edit', credentials)
    },
    delete(credentials) {
        return Api().post('/clinics/delete', credentials)
    },
    addDoctor(credentials) {
        return Api().post('/clinics/addDoctor', credentials)
    },
    deleteDoctor(credentials) {
        return Api().post('/clinics/deleteDoctor', credentials)
    },
    addReceptionist(credentials) {
        return Api().post('/clinics/addReceptionist', credentials)
    },
    deleteReceptionist(credentials) {
        return Api().post('/clinics/deleteReceptionist', credentials)
    },
    addPharmacist(credentials) {
        return Api().post('/clinics/addPharmacist', credentials)
    },
    deletePharmacist(credentials) {
        return Api().post('/clinics/deletePharmacist', credentials)
    },
    findClinicByReceptionist(credentials) {
        return Api().post('/clinics/findClinicByReceptionist', credentials)
    },
}