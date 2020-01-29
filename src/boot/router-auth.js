import {LocalStorage} from 'quasar'
export default ({router}) => {
  router.beforeEach((to, from, next) => {
		let loggedIn = LocalStorage.getItem('loggedIn')
		if (!loggedIn && to.path.startsWith('/admin')) {
		  next('/')
		}
		else if (loggedIn && to.path.startsWith('/auth')) {
			next('/admin')
		}
		else {
		  next()
		}
  })
}