const menuitems = state => state.menu.items

const defaultItem = state => state.menu.default

const getLoginStatus = state => state.login.isLogin

export {
    menuitems,
    defaultItem,
    getLoginStatus
}
