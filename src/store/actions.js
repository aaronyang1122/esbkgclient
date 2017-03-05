import * as types from './mutation-types'

export const setDefaultItem = ({ commit }, defaultItem) => {
  if (defaultItem !== '') {
    commit(types.DEFAULT_MENU_ITEM, defaultItem)
  }
}

export const setMenus = ({ commit }, e) => {
	commit(types.SET_MENU_ITEMS, e)
}

export const setLoginStatus = ({ commit }, e) => {
    commit(types.SET_LOGIN_STATUS, e)
}