import Api from '@/services/api'

export default {
    all(credentials) {
        return Api().post('/bookings/all', credentials)
    },
    getAllBookingsBySpecialty(credentials) {
        return Api().post('/bookings/getAllBookingsBySpecialty', credentials)
    },
    getBooking(bookingId) {
        return Api().post('/bookings/booking/' + bookingId)
    },
    create(credentials) {
        return Api().post('/bookings/create', credentials)
    },
    very(credentials) {
        return Api().post('/bookings/very', credentials)
    },
    edit(credentials) {
        return Api().post('/bookings/edit', credentials)
    },
    delete(credentials) {
        return Api().post('/bookings/delete', credentials)
    },
    healthcare(credentials) {
        return Api().post('/bookings/healthcare', credentials)
    },
}