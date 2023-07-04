import Vue from 'vue'
import Vuex from 'vuex'
import menu from './modules/menu'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: ''
    },
    getters: {},
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
            localStorage.setItem("v2-token", token)
        },

    },
    actions: {},
    modules: { menu }
})