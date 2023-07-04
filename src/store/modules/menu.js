import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
    state: {
        userId: '',
        test: 0,
        menuList: [],
        permList: [],
        hasRouter: false,
        editableTabsValue: 'Index',
        editableTabs: [{
            title: '首页',
            name: 'Index',

        }],
    },
    getters: {},
    mutations: {

        SET_USERID(state, userId) {
            state.userId = userId
        },

        SET_MENULIST(state, menus) {
            state.menuList = menus

        },
        SET_PERMLIST(state, perms) {
            state.permList = perms
        },
        changeRouterStatus(state, hasRouter) {
            state.hasRouter = hasRouter
                // sessionStorage.setItem("hasRoute", hasRoute)
        },
        addTab(state, tab) {
            let index = state.editableTabs.findIndex(e => e.name === tab.name)
            if (index === -1) {
                state.editableTabs.push({
                    title: tab.title,
                    name: tab.name
                })

            }


            state.editableTabsValue = tab.name;
        },
        editableTabsHome(state) {
            state.editableTabsValue = 'Index'
        },
        resetState(state) {
            state.menuList = []
            state.permList = []
            state.hasRouter = false
            state.editableTabsValue = 'Index'
            state.editableTabs = [{
                title: '首页',
                name: 'Index'
            }]
        }
    },
    actions: {},
    modules: {}
}