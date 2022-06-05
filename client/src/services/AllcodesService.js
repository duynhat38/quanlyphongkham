import Api from '@/services/api'

export default {
    index(credentials) {
        return Api().post('/allcodes', credentials)
    },
}