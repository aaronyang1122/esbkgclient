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

export const setToken = ({ commit }, value) => {
  if (typeof value === 'string') {
    commit(types.SET_TOKEN, value)
  }
}

export const allroles = ({ commit }, arr) => {
	if (arr.constructor === Array) {
		commit(types.SET_ALLROLE_LIST, arr)
	}
}

export const allgames = ({ commit }, arr) => {
	if (arr.constructor === Array) {
		commit(types.SET_ALLGAME_LIST, arr)
	}
}

export const allmenus = ({ commit }, arr) => {
	if (arr.constructor === Array) {
		commit(types.SET_ALLMENU_LIST, arr)
	}
}

export const setMenus = ({ commit }, e) => {
	commit(types.SET_MENU_ITEMS, e)
}

export const setRoleMenus = ({ commit }, e) => {
	commit(types.SET_ALLROLE_MENUS, e)
}
