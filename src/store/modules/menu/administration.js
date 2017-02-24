import { lazyLoading } from '../../../common/common'

export default {
  name: 'administration',
  path: '/administration',
  meta: {
    icon: 'el-icon-setting',
    title: '管理'
  },
	component: lazyLoading('Administration', true),
  children: [
    {
      name: 'customer',
      path: 'customer',
      component: lazyLoading('Administration/Customer'),
      meta: {
		    title: '用户管理'
		  }
    },
    {
      name: 'game',
      path: 'game',
      component: lazyLoading('Administration/Game'),
      meta: {
		    title: '游戏管理'
		  }
    },
    {
      name: 'log',
      path: 'log',
      component: lazyLoading('Administration/Log'),
      meta: {
		    title: '日志查看'
		  }
    },
    {
      name: 'menu',
      path: 'menu',
      component: lazyLoading('Administration/Menu'),
      meta: {
		    title: '菜单管理'
		  }
    },
    {
      name: 'role',
      path: 'role',
      component: lazyLoading('Administration/Role'),
      meta: {
		    title: '角色管理'
		  }
    },
    {
    	name: 'rights',
      path: 'rights',
      component: lazyLoading('Administration/Rights', true),
      children: [
	      {
		      name: 'userrights',
		      path: 'user',
		      component: lazyLoading('Administration/Rights/User'),
		      meta: {
				    title: '用户映射'
				  }
		    },
		    {
		      name: 'rolerights',
		      path: 'role',
		      component: lazyLoading('Administration/Rights/Role'),
		      meta: {
				    title: '角色映射'
				  }
		    }
      ],
      meta: {
		    title: '权限管理'
		  }
    }
  ]
}
