import * as types from '../../mutation-types'

const state = {
	default: null,
  	items: []
}

const mutations = {
	[types.SET_MENU_ITEMS] (state, menuItem) {
		switch (menuItem.constructor) {
			case Array:
				state.items = state.items.concat(menuItem);
				break;
			case Object:
				state.items.push(menuItem);
				break;
		}
	},
	[types.DEFAULT_MENU_ITEM] (state, defaultItem) {
		state.default = defaultItem
	}
}

export default {
  	state,
  	mutations
}
