import {
	LocalStorage,
	Loading
} from 'quasar'
import axios from 'axios'
import {
  showErrorMessage
} from 'src/functions/error-messages.js'

const state = {
   loggedIn: false,
	token: LocalStorage.getItem('token') || '',
	user_data: {},
	date1:'',
	date2:'',
	beweek1:'',
	biweek2:'',
	permissions:{}
}

const actions = {
   logInUser({commit}, data){
		const token = 'bearer ' + data.meta.token
		LocalStorage.set('token', token)
		LocalStorage.set('expires_in', data.meta.expires_in)
		LocalStorage.set('isDark', data.user.dark)
		axios.defaults.headers.common['Authorization'] = token
		commit('logInUser', data)
		Loading.hide()
		this.$router.push('/admin')
	},

	LogoutUser({commit}){
		commit('LogoutUser')
		Loading.hide()
		this.$router.push('/').catch(err => {})
	},

	checkIfAuthenticated({commit}){
		showErrorMessage('La sesión ha expirado')
		commit('LogoutUser')
		this.$router.push('/').catch(err => {})
	},

	storeUser({commit}, data){
		commit('storeUser', data)
	},

	storeUserData({commit}, data) {
	  commit('storeUserData', data)
	},

	setDark({commit}, data){
		commit('setDark', data)
	},

	storeUserDataIndividual({commit}, data){
		commit('storeUserDataIndividual', data)
	},

	updateImage({commit}, data){
		commit('updateImage', data)
	},

	changeBinnacle({commit}, data){
		commit('changeBinnacle', data)
	},

	changeStatus({commit}, data){
		commit('changeStatus', data)
	}
	
}

const mutations = {
   logInUser(state, data){
		state.token = 'bearer ' + data.meta.token
		state.loggedIn = true
		LocalStorage.set('loggedIn', true)
	}, 

	LogoutUser(state){
		LocalStorage.set('loggedIn', false)
		LocalStorage.set('token', '')
		LocalStorage.set('user', '')
		state.token = ''
		state.loggedIn = false
		state.user_data = {}
	},

	storeUser(state, data){
		state.user_data = data.user
		LocalStorage.set('isDark', data.user.dark)
		LocalStorage.set('binnacles', data.user.binnacles)
		LocalStorage.set('status_view', data.user.status_view)
		state.permissions = data.init_data.original.permissions
	},

	storeUserData(state, data){
		state.user_data = data
	},

	setDark(state, data){
		state.user_data.dark = data.dark
		LocalStorage.set('isDark', data.dark)
	},

	storeUserDataIndividual(state, data){
		state.user_data.name = data.name
		state.user_data.last_name = data.last_name
		state.user_data.initials = data.initials
		state.user_data.email = data.email
		state.user_data.username = data.username
		state.user_data.phone = data.phone
		state.user_data.office = data.office
		state.user_data.birth_date = data.birth_date
		state.user_data.user_data = data.user_data
	}, 

	updateImage(state, data){
		state.user_data.avatar_img = data
	},

	changeBinnacle(state, data){
		state.user_data.binnacles = data.binnacles
		LocalStorage.set('binnacles', data.binnacles)
	},

	changeStatus(state, data){
		state.user_data.status_view = data.status_view
		LocalStorage.set('status_view', data.status_view)
	},
}

const getters = {
	loggedIn: state => !!state.token,
	user_data(state) {
	  return state.user_data;
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}