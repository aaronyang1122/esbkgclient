import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import menu from './modules/menu'
import token from './modules/token'
import rights from './modules/rights'
import Promise from 'babel-polyfill'

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    menu,
    token,
    rights
  }
})