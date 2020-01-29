<template>
	<q-page class="flex flex-center">
		<img alt="Emporio Legal" src="statics/logos/logo-full.png">	
	</q-page>
</template>

<script>
import {mapActions, mapState, mapGetters} from 'vuex'
export default {
	  name: 'PageIndex',
	  
	components:{
		'password':require('components/User/Password.vue').default,
	},

	computed:{
			...mapState('auth', ['user_data']),
	},
}
</script>
