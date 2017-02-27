import Vue from 'vue'
import ElementUI from 'element-ui'
// import Router from 'vue-router'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
import router from './router/'
import store from './store'
import VueResource from 'vue-resource'
import administration from './store/modules/menu/administration'
import { lazyLoading, generateRoutesFromMenu } from './common/common'

Vue.use(ElementUI)
Vue.use(VueResource)
// Vue.use(Router)

/*Vue.http.interceptors.push((request, next) => {
	if (request.method === 'POST') {
		// if request = 'POST' send request body as application/x-www-form-urlencoded content type
		request['emulateJSON'] = true
	}
  next((response) => {
  	// api without '/api/getCsrf' if response code !== 0 throw Err
		if (response.body.code === -1 && !/getCsrf/g.test(request.url)) {
			console.warn(response.body.code, 'there must have same problems with Authention')
		}
  })
})*/










// request to get token
/*
Vue.http.get('/api/getCsrf').then((response) => {
	// success & save token to the state
  store.dispatch('setToken', response.body.content)
}, (err) => {
	// throw err
  console.warn(err, 'can not get token')
});
*/


// start vue
new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})

/*
// start a Promise
_router.list().then(
	(res) => {
		// router start
		const router = new Router({
		  mode: 'hash',
		  routes: res
		})
		// start vue
		new Vue({
			el: '#app',
			store,
			router,
			render: h => h(App)
		})
	}, 
	(err) => {
		// failed
		console.warn(err)
	}
)*/
