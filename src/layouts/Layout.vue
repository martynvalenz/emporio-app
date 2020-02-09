<template>
	<div>
		<q-layout view="hHh Lpr lfr">
			<q-header elevated class="text-white" style="background-image: linear-gradient(to right, #083697 , #333399);">
			<!-- <q-header elevated class="text-white"> -->
				<q-toolbar>
					<q-btn  flat round icon="menu" @click="left = !left" class="q-mr-xs" />
					<q-separator dark vertical inset />
					<q-toolbar-title>Emporio Legal</q-toolbar-title>
					<!-- <q-btn dense round flat icon="mail" class="q-mr-sm">
						<q-badge color="red" floating>
						4
						</q-badge>
					</q-btn>
					<q-btn dense round flat icon="notifications" class="q-mr-sm">
						<q-badge color="red" floating>
						4
						</q-badge>
					</q-btn> -->
					<!-- <q-btn dense flat round icon="menu" @click="right = !right" /> -->
					<q-avatar clickable v-ripple>
						<img :src="user_data.avatar_img" style="border-radius:50%; border: 1px solid grey">
						<q-menu auto-close>
							<div class="row no-wrap q-ma-xs">
								<div class="column">
									<q-item-label header>Menu de usuario</q-item-label>
									<q-list>
										<q-item clickable v-ripple to="/admin/profile">
											<q-item-section>Perfil</q-item-section>
											<q-item-section side><q-icon name="person" /></q-item-section>
										</q-item>
										<q-item clickable v-ripple @click="changePassword">
											<q-item-section>Cambiar contraseña</q-item-section>
											<q-item-section side><q-icon name="vpn_key" /></q-item-section>
										</q-item>
										<q-item>
											<q-item-section>Modo Oscuro</q-item-section>
											<q-toggle v-model="dark" @input="ToggleDarkMode" :disable="!dark_enabled" />
										</q-item>
										<q-item clickable v-ripple @click="logOut">
											<q-item-section>Cerrar Sesión</q-item-section>
											<q-item-section side><q-icon name="power_settings_new" color="red" /></q-item-section>
										</q-item>
									</q-list>
								</div>

								<q-separator vertical inset class="q-mx-sm" />

								<div class="column items-center">
									<q-avatar size="72px" class="q-mt-md">
										<img :src="user_data.avatar_img" style="border-radius:50%;">
									</q-avatar>
									<div class="text-subtitle2 self-center q-mt-sm q-mb-xs">{{user_data.name}} {{user_data.last_name}}</div>
								</div>
							</div>
						</q-menu>
					</q-avatar>
				</q-toolbar>
			</q-header>
			<q-drawer :breakpoint="767" :width="250" show-if-above v-model="left" side="left" elevated>
				<menu-list :user_data="user_data" :permissions="permissions"></menu-list>
			</q-drawer>
			<!-- <q-page-container :style="$q.dark == false ? {'background':'grey'}"> -->
			<q-page-container>
				<router-view />
			</q-page-container>
			<q-footer bordered class="bg-grey-8 text-white">
				<div class="row q-pr-sm">
					<div class="col items-center justify-end" style="text-align:right;">
						v5.0
					</div>
				</div>
			</q-footer>
			<password ref="change_password"></password>
		</q-layout>
	</div>
	
</template>

<script>
import {LocalStorage, Loading} from 'quasar'
import {mapActions, mapState} from 'vuex'
export default {
  data () {
		return {
			left: true,
			right: true,
			mobileData: true,
      	bluetooth: false,
			dark:true,
			dark_enabled:true,
			activate_loading:false,
		}
	},
	components:{
		'menu-list':require('components/Main/Menu.vue').default,
		'password':require('components/User/Password.vue').default,
	},
	created(){
		let isDark = LocalStorage.getItem('isDark')
		if(isDark == 1){
			this.$q.dark.set(true)
			this.dark = true
		}
		else{
			this.$q.dark.set(false)
			this.dark = false
		}
		this.checkIfAuth()
		
	},
	mounted(){
		
	},
	beforeMount(){
		// this.checkIfAuth()
	},
	computed:{
		...mapState('auth', ['user_data', 'permissions']),
	},
	methods:{
		...mapActions('auth', ['LogoutUser', 'checkIfAuthenticated', 'storeUser', 'setDark']),
		logOut(){
			Loading.show()
			this.$axios.post(`${process.env.API}/logout`)
         .then(res => {
				this.LogoutUser()
         })
         .catch(error => {
				Loading.hide()
            console.log(error.response.data)
         })
		},
		checkIfAuth(){
			this.$axios.get(`${process.env.API}/me`)
			.then(res => {
				this.storeUser(res.data)
         })
         .catch(error => {
				// this.logOut()
				this.checkIfAuthenticated()

         })
		},

		ToggleDarkMode(){
			this.dark_enabled = false
			if(this.dark == true){
				let formData = {dark:1}
				this.$axios.post(`${process.env.API}/user/dark-mode`, formData)
				.then(res => {
					this.setDark(formData)
					this.$q.dark.set(true)
					this.dark_enabled = true
				})
				.catch(error => {
					this.dark == false
					this.dark_enabled = true
				})
			}
			else {
				let formData = {dark:0}
				this.$axios.post(`${process.env.API}/user/dark-mode`, formData)
				.then(res => {
					this.setDark(formData)
					this.$q.dark.set(false)
					this.dark_enabled = true
				})
				.catch(error => {
					this.dark == true
					this.dark_enabled = true
				})
			}
		},

		setDarkMode(){
			
		},

		changePassword(){
         this.$refs.change_password.changePassword()
		},

		activateAccount(){
			this.activate_loading = true
			this.$axios.post(`${process.env.API}/user/activate-account`)
			.then(success => {
				this.$q.notify({
					message:'Se activó la cuenta',
					color:'positive',
					actions: [
						{ label: 'Cerrar', color: 'white', handler: () => {  } }
					]
				})
				this.activate_loading = false
				this.checkIfAuth()
			})
			.catch(error => {
				if(error.response.data.success == false){
					this.activate_loading = false
					this.$q.notify({
						message:error.response.data.msg,
						color:'negative',
						actions: [
							{ label: 'Cerrar', color: 'white', handler: () => {  } }
						]
					})
				}
				else{
					this.errors = error.response.data.errors
					this.activate_loading = false
					this.$q.notify({
						message:'No se pudo activar la cuenta',
						color:'negative',
						actions: [
							{ label: 'Cerrar', color: 'white', handler: () => {  } }
						]
					})
				}
			})
		},

		toStores(){
			this.$router.push('/admin/user/stores')
		},

		changeStore(code){

		}
	}
}
</script>

<style lang="css">
	.footer-logo{
		height: 20px;
		width:auto;
	}

	.linker{
		text-decoration: none;
		color: white;
		padding-right: 0.5em;
	}
	.linker:hover{
		color: rgb(149, 185, 233);
	}

	.theme-after{
      position:relative;

   }

   .theme-after:after{
      width: 80px;
      height: 2px;
      content: "";
      position: absolute;
      left: 0;
      background-color: #000;
      right: 0;
      margin: auto;
      bottom: 0; 
   }
</style>

<style lang="sass">
.my-sticky-header-table
  /* max height is important */
  .q-table__middle
    max-height: 200px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    /* background-color: #c1f4cd */

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>