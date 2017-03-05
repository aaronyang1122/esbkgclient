/**
 * Created by yangjian on 2017/3/5.
 */
import * as types from '../mutation-types'

const state = {
    isLogin: false
}

const mutations = {
    [types.SET_LOGIN_STATUS] (state, status) {
        state.isLogin = status;
    }
}

export default {
    state,
    mutations
}
