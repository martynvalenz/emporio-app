<template>
   <q-page class="full-width row wrap justify-center items-center content-center">
      <q-card style="width: 100%; max-width: 400px" class="q-pt-md">
         <q-card-section class="row wrap justify-center items-center q-pb-lg">
            <img src="statics/logos/logo-full.png" alt="Logo Emporio Legal" style="max-height: 240px; width:auto" />
         </q-card-section>
         <q-card-section class="q-pa-md">
            <q-form class="q-gutter-lg" @submit.prevent="logIn">
               <q-input v-model="username" outlined label="Usuario" ref="username" :rules="[ val => val.length >= 1 || 'Este campo es obligatorio']" >
                  <template v-slot:prepend>
                     <q-icon name="person" />
                  </template>
               </q-input>
               <q-input v-model="password" outlined label="Contraseña" ref="password" :type="isPassword ? 'password' : 'text'" :rules="[ val => val.length >= 1 || 'Este campo es obligatorio']" >
                  <template v-slot:prepend>
                     <q-icon name="vpn_key" />
                  </template>
                  <template v-slot:append>
                     <q-icon
                        :name="isPassword ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPassword = !isPassword"
                     />
                  </template>
               </q-input>
               <div>
                  <q-btn label="Olvidé mi contraseña" flat color="secondary" to="/auth/remember" />
               </div>
               <div>
                  <q-btn label="Iniciar sesión" :loading="loading" type="submit" color="secondary" class="full-width"/>
               </div>
            </q-form>
         </q-card-section>
      </q-card>
   </q-page>
</template>

<script>
import {mapActions} from 'vuex'
import {Loading} from 'quasar'
import {showErrorMessage} from 'src/functions/error-messages.js'
export default {
   name: 'Login',
	meta () {
      return {
         title: 'Emporio - Login',
      }
   },
   data(){
      return{
         // username:'martynvalenz@gmail.com',
         // password:'secret',
         username:'',
         password:'',
         isPassword: true,
         rememberMe:true,
         errors:{},
         loading:false
      }
   },

   methods:{
      ...mapActions('auth', ['logInUser']),
      logIn(){
         this.$refs.username.validate()
         this.$refs.password.validate()
         if(!this.$refs.username.hasError && !this.$refs.password.hasError){
            Loading.show()
            this.loading = true
            let formData = {username:this.username, password:this.password}
            this.$axios.post(`${process.env.API}/login`,formData)
            .then(res => {
               this.loading = false
               this.logInUser(res.data)
            })
            .catch(error => {
               this.errors = error.response.data.errors
               showErrorMessage(error.response.data.errors)
               Loading.hide()
               this.loading = false
               this.$q.notify({
                  message:'No se pudo iniciar sesión, revise los errores en el formulario',
                  color:'negative',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
            })
         }
      }
   }
}
</script>