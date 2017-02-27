/**
 * Created by yangjian0101 on 2017/2/27.
 */

import { lazyLoading } from '../../../common/common'

export default {
    name: 'news',
    path: '/news',
    meta: {
        icon: 'el-icon-setting',
        title: '新闻'
    },
    component: lazyLoading('News')
}