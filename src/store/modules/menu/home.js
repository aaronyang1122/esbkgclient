/**
 * Created by yangjian0101 on 2017/2/27.
 */

import { lazyLoading } from '../../../common/common'

export default {
    name: 'home',
    path: '/home',
    meta: {
        icon: 'el-icon-setting',
        title: '首页'
    },
    component: lazyLoading('Home', true),
    children: [
        {
            name: 'slider',
            path: 'slider',
            component: lazyLoading('Home/Slider'),
            meta: {
                title: '轮播图'
            }
        },
        {
            name: 'section',
            path: 'section',
            component: lazyLoading('Home/Section'),
            meta: {
                title: '首页大图'
            }
        },
        {
            name: 'expressway',
            path: 'expressway',
            component: lazyLoading('Home/Expressway'),
            meta: {
                title: '快速入口'
            }
        },
        {
            name: 'companyinfo',
            path: 'companyinfo',
            component: lazyLoading('Home/Companyinfo'),
            meta: {
                title: '公司信息'
            }
        }
    ]
}
