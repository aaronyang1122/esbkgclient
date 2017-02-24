const menuitems = state => state.menu.items

const defaultItem = state => state.menu.default

const componententry = state => {
  return state.menu.items.filter(c => c.meta && c.meta.label === 'Components')[0]
}

const getToken = state => state.token.token

const getAllgames = state => state.rights.rights.allgames

const getAllroles = state => state.rights.rights.allroles

const getAllmenus = state => state.rights.rights.allmenus

const getAllrolemenus = state => state.rights.rights.allrolemenus

export {
  menuitems,
  componententry,
  defaultItem,
  getToken,
  getAllgames,
  getAllroles,
  getAllmenus,
  getAllrolemenus
}
