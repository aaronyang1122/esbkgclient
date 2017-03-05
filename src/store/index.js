import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import menu from './modules/menu'
import login from './modules/login'
import Promise from 'babel-polyfill'

Vue.use(Vuex)

export default new Vuex.Store({
    actions,
    getters,
    modules: {
        menu,
        login
    }
})