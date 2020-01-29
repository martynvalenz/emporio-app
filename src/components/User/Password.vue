<template>
   <div>
      <q-dialog v-model="password_dialog">
         <q-card max-width="400px" style="width: 350px;">
            <q-card-section class="row">
               <div class="text-h6">Cambiar contraseña</div>
               <q-space />
               <q-btn flat round dense icon="close" v-close-popup />
            </q-card-section>
            <q-card-section class="q-my-lg">
               <q-form class="q-gutter-md">
                  <q-input v-model="actual_password" outlined label="Contraseña actual" ref="actual_password" :type="isPassword ? 'password' : 'text'" :rules="[ val => val.length >= 6 || 'Este campo es obligatorio y debe contener al menos 6 caracteres']" :hint="errors.actual_password" lazy-rules>
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
                  <q-input v-model="password" outlined label="Contraseña nueva" ref="password" :type="isPassword ? 'password' : 'text'" :rules="[ val => val.length >= 6 || 'Este campo es obligatorio y debe contener al menos 6 caracteres']" :hint="errors.password" lazy-rules>
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
               </q-form>
            </q-card-section>
            <q-card-section class="row"> 
               <q-space />
               <q-btn label="Cerrar" class="q-mx-xs" flat v-close-popup />
               <q-btn label="Actualizar" class="q-mx-xs" color="primary" :loading="password_loading" @click="updatePassword" />
            </q-card-section>
         </q-card>
      </q-dialog>
   </div>
</template>

<script>
export default {
   data(){
      return{
         //Password
         password_dialog:false,
         password:'',
         actual_password:'',
         isPassword:true,
         password_loading:false,
         errors:{}
      }
   },

   methods:{
      changePassword(){
         this.password = ''
         this.actual_password = ''
         this.isPassword = true
         this.password_dialog = true
      },

      updatePassword(){
         this.$refs.password.validate()
         this.$refs.actual_password.validate()
         if(!this.$refs.password.hasError && !this.$refs.actual_password.hasError){
            this.password_loading = true
            this.$axios.post(`${process.env.API}/user/change-password`, {actual_password:this.actual_password, password:this.password})
            .then(success => {
               this.$q.notify({
                  message:'Se actualizó la contraseña',
                  color:'positive',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
               this.password_loading = false
               this.password_dialog = false
               this.password = ''
               this.actual_password = ''
            })
            .catch(error => {
               if(error.response.data.success == false){
                  this.password_loading = false
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
                  this.password_loading = false
                  this.$q.notify({
                     message:'No se pudo actualizar la contraseña',
                     color:'negative',
                     actions: [
                        { label: 'Cerrar', color: 'white', handler: () => {  } }
                     ]
                  })
               }
            })
         }
         else{
            this.password_loading = false
            this.$q.notify({
               message:'No se pudo actualizar la contraseña',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         }
      },
   }
}
</script>