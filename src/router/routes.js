
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
			{ path: '/admin/services/catalog', component
			: () => import('pages/admin/services/catalog.vue') },
			{ path: '/admin/services/comissions', component: () => import('pages/admin/services/comissions.vue') },
			{ path: '/admin/services/services-control', component: () => import('pages/admin/services/services-control.vue') },
			//Customers
			{ path: '/admin/customers/strategies', component: () => import('pages/admin/customers/strategies.vue') },
			{ path: '/admin/customers/customers', component: () => import('pages/admin/customers/customers.vue') },
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
