import * as types from '../mutation-types'

const state = {
	rights: {
		allgames: [],
		allroles: [],
		allmenus: [],
		allrolemenus: []
	}
}

const mutations = {
  [types.SET_ALLGAME_LIST] (state, arr) {
  	state.rights.allgames = arr
  },
  [types.SET_ALLROLE_LIST] (state, arr) {
  	state.rights.allroles = arr
  },
  [types.SET_ALLMENU_LIST] (state, arr) {
  	state.rights.allmenus = arr
  },
  [types.SET_ALLROLE_MENUS] (state, arr) {
  	state.rights.allrolemenus = arr
  }
}

export default {
  state,
  mutations
}
