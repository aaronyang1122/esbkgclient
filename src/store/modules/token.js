import * as types from '../mutation-types'

const state = {
	token: ''
}

const mutations = {
  [types.SET_TOKEN] (state, value) {
  	state.token = value
  }
}

export default {
  state,
  mutations
}
