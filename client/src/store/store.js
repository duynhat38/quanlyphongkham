import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const getDefaultState = () => {
    return {
        token: null,
        user: null
    }
}

const store = new Vuex.Store({
    strict: true,
    plugins: [
        createPersistedState({
            key: 'data'
        })
    ],
    state: getDefaultState(),
    mutations: {
        setToken(state, token) {
            state.token = token
        },
        setUser(state, user) {
            state.user = user
        },
        clearState(state) {
            Object.assign(state, getDefaultState())
        }
    },
    actions: {
        setToken({ commit }, token) {
            commit('setToken', token)
        },
        setUser({ commit }, user) {
            commit('setUser', user)
        },
        clearState({ commit }) {
            commit('clearState')
        }
    }
})

export default store;