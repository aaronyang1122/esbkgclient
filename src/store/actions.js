import * as types from './mutation-types'

export const expandMenu = ({ commit }, menuItem) => {
  if (menuItem) {
    menuItem.expanded = menuItem.expanded || false
    commit(types.EXPAND_MENU, menuItem)
  }
}

export const setDefaultItem = ({ commit }, defaultItem) => {
  if (defaultItem !== '') {
    commit(types.DEFAULT_MENU_ITEM, defaultItem)
  }
}

export const setMenus = ({ commit }, e) => {
	commit(types.SET_MENU_ITEMS, e)
}
