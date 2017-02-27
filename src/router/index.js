import Vue from 'vue'
// import VueResource from 'vue-resource'
import Router from 'vue-router'
import store from '../store'
import { lazyLoading, generateRoutesFromMenu, requireAuth } from '../common/common'
import administration from '../store/modules/menu/administration'
import home from '../store/modules/menu/home'
import news from '../store/modules/menu/news'
import product from '../store/modules/menu/product'

let _list = []

_list.push(home, news, product);

store.dispatch('setMenus', _list)

store.dispatch('setDefaultItem', _list[0].children ? _list[0].children[0].name : _list[0].name)

Vue.use(Router);

export default new Router({
	routes: [
        {
            path: '/signin',
            name: 'signin',
            component: require('../components/views/Signin.vue')
        },
        {
            name: 'main',
            path: '/',
            beforeEnter: requireAuth(true, store),
            component: lazyLoading('Main'),
            children: [
                ...generateRoutesFromMenu(_list)
            ]
        },
        {
            path: '*',
            redirect () {
                console.log('redirect')
                // router.go(-1)
                return '/'
            }
        }
	]
})

/*
export default {
	list () {
		return new Promise((resolve, reject) => {
			// get menulist
			Vue.http.get('/api/menuList').then((response) => {
			  let _list,
			  		_indexName

			  _list	= response.body.content.constructor === Array ? formatMenuList(response.body.content) : []

			  _list.push(administration)

			  if (_init.include.length === 0) {
			  	_list = [{
			  		path: '/home',
			    	name: 'home',
			    	component: require('../components/views/Home.vue'),
			    	meta: {
					    title: 'Home'
					  }
			  	}]
			  } else {
			  	_list = Array.prototype.filter.call(_list, (e, i, a) => {
						return _init.include.some(f => e.name === f)
				  })
			  }

			  store.dispatch('setMenus', _list)

				_indexName = _list[0].children ? _list[0].children[0].name : _list[0].name

				store.dispatch('setDefaultItem', (_init.indexRoute === '' || !_some.call(_list, _init.indexRoute)) ? _indexName : _init.indexRoute)

				resolve([
					{
			    	path: '/signin',
			    	name: 'signin',
			    	component: require('../components/views/Signin.vue')
			   	},
			    {
			      name: 'main',
			      path: '/',
			      beforeEnter: requireAuth(_init.skipLogin, store),
			      component: lazyLoading('Main'),
			      children: [
			      	...generateRoutesFromMenu(_list)
			      ]
			    },
			    {
			      path: '*',
			      redirect () {
			      	console.log('redirect')
							// router.go(-1)
			        return '/'
			      }
			    }
				])
			}, (err) => {
			  console.warn(err, 'can not get menuList')
			  reject(error)
			})
			.catch(error => {
		  	reject(error)
		  })
		})
	}
} */
