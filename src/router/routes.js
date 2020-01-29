
const routes = [
	{
		path: '/',
		component: () => import('layouts/Auth.vue'),
		children: [
			{ path: '', component: () => import('pages/auth/login.vue') }
		]
	},
	{
		path: '/admin',
		component: () => import('layouts/Layout.vue'),
		children: [
		  { path: '', component: () => import('pages/admin/index.vue') },
		  { path: '/admin/profile', component: () => import('pages/admin/profile.vue') },
		  //services
		  { path: '/admin/services/categories', component: () => import('pages/admin/services/categories.vue') },
		  { path: '/admin/services/subcategories', component: () => import('pages/admin/services/subcategories.vue') },
		  { path: '/admin/services/binnacles', component: () => import('pages/admin/services/binnacles.vue') },
		  { path: '/admin/services/services-catalog', component: () => import('pages/admin/services/services-catalog.vue') },
		]
	 },
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
	routes.push({
		path: '*',
		component: () => import('pages/Error404.vue')
	})
}

export default routes
