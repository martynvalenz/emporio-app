<template>
	<q-layout view="hHh lpR fFf" style="background:#f5f5f5;">
		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script>
export default {
  	data () {
		return {
			left: false,
			right: false
		}
	},
	
	created(){
      this.$q.dark.set(false)
   }
	/* computed:{
		loggedIn(){
			return this.$store.getters.loggedIn
		}
	},

	methods:{
		logout(){
			this.$store.dispatch('auth/logout')
			.then(() => {
				this.$router.push('/auth')
			})
		}
	} */
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

</style>