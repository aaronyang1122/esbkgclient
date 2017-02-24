import * as types from '../../mutation-types'
//import administration from './administration'

// show: meta.label -> name
// name: component name
// meta.label: display label

const state = {
	default: null,
  items: []
}

//state.items.push(administration)

const mutations = {
//[types.EXPAND_MENU] (state, menuItem) {
//  if (menuItem.index > -1) {
//    if (state.items[menuItem.index] && state.items[menuItem.index].meta) {
//      state.items[menuItem.index].meta.expanded = menuItem.expanded
//    }
//  } else if (menuItem.item && 'expanded' in menuItem.item.meta) {
//    menuItem.item.meta.expanded = menuItem.expanded
//  }
//},
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
