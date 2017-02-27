/**
 * Created by yangjian0101 on 2017/2/27.
 */

import { lazyLoading } from '../../../common/common'

export default {
    name: 'product',
    path: '/product',
    meta: {
        icon: 'el-icon-setting',
        title: '产品'
    },
    component: lazyLoading('Product')
}