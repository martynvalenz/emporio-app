<template>
   <q-page padding>
      <q-card>
         <q-card-section>
            <div class="row q-ma-xs">
               <div class="column">
                  <div v-if="!selectedFile" style="display: inline-block; position: relative; width: 180px; height: 180px; overflow: hidden; border-radius:50%;">
                     <img :src="user_data.avatar_img" style="height: 180px; width:180px; top:50%">
                     <div class="absolute-full flex flex-center">
                        <q-btn push style="background-color:rgba(223,223,223,0.6)" text-color="white" round icon="party_mode" @click="pickFile">
                           <q-tooltip content-class="bg-grey-9" content-style="font-size: 13px">
                              Seleccionar imagen.
                           </q-tooltip>
                        </q-btn>
                     </div>
                  </div>
                  <div v-if="selectedFile" style="display: inline-block; position: relative; width: 180px; height: 180px; overflow: hidden; border-radius:50%;">
                     <img :src="new_image" style="height: 180px; width:180px; top:50%">
                     <div class="absolute-full flex flex-center">
                        <q-btn push style="background-color:rgba(25, 179, 61,0.7)" text-color="white" round icon="save" class="q-mx-xs" @click="UploadImage" :loading="loading_avatar" />
                        <q-btn push style="background-color:rgba(237, 69, 88,0.7)" text-color="white" round icon="close" class="q-mx-xs" @click="CancelImage" />
                     </div>
                  </div>

                  <input ref="fileSelected" class="fileSelected" @input="onFileSelected" type="file"  accept="image/*" style="display:none;" />
                  <div class="column text-subtitle2 self-center q-mt-sm q-mb-xs">{{user_data.name}}</div>
               </div>
               <q-separator vertical inset class="q-mx-md" />
               <div class="column">
                  <q-btn color="secondary" class="q-ma-xs" label="Guardar Cambios" :loading="loading" @click="saveUser" icon-right="save" />
                  <q-btn color="grey" class="q-ma-xs" label="Cambiar contraseña" @click="changePassword" icon-right="vpn_key" />
               </div>
            </div>
            <div class="row">
               <div class="col-xs-4 col-sm-4 col-md-3 col-lg-1 col-xl-1 q-pa-xs">
                  <q-input v-model="initials" label="Iniciales" outlined class="text-uppercase" maxlength="5"></q-input>
                  <div class="text-subtitle2 text-red" v-for="error in errors.initials" :key="error">
                     {{error}}
                  </div>
               </div>
               <div class="col-xs-8 col-sm-8 col-md-5 col-lg-3 col-xl-3 q-pa-xs">
                  <q-input v-model="name" label="Nombre" outlined></q-input>
                  <div class="text-subtitle2 text-red" v-for="error in errors.name" :key="error">
                     {{error}}
                  </div>
               </div>
               <div class="col-xs-8 col-sm-8 col-md-5 col-lg-3 col-xl-3 q-pa-xs">
                  <q-input v-model="last_name" label="Apellido" outlined></q-input>
                  <div class="text-subtitle2 text-red" v-for="error in errors.last_name" :key="error">
                     {{error}}
                  </div>
               </div>
               <div class="col-xs-12 col-sm-12 col-md-5 col-lg-4 col-xl-4 q-pa-xs">
                  <q-input v-model="username" label="Usuario" outlined class="text-lowercase"></q-input>
                  <div class="text-subtitle2 text-red" v-for="error in errors.username" :key="error">
                     {{error}}
                  </div>
               </div>
            </div>
            <div class="row">
               <div class="col-xs-12 col-sm-12 col-md-5 col-lg-4 col-xl-4 q-pa-xs">
                  <q-input v-model="email" label="Correo" type="email" outlined></q-input>
                  <div class="text-subtitle2 text-red" v-for="error in errors.email" :key="error">
                     {{error}}
                  </div>
               </div>
               <div class="col-xs-8 col-sm-8 col-md-4 col-lg-2 col-xl-2 q-pa-xs">
                  <q-input v-model="phone" label="Celular" outlined mask="(###) ### - ####" ></q-input>
                  <div class="text-subtitle2 text-red" v-for="error in errors.phone" :key="error">
                     {{error}}
                  </div>
               </div>
               <div class="col-xs-8 col-sm-8 col-md-4 col-lg-2 col-xl-2 q-pa-xs">
                  <q-input v-model="office" label="Oficina" outlined mask="(###) ### - ####" ></q-input>
                  <div class="text-subtitle2 text-red" v-for="error in errors.office" :key="error">
                     {{error}}
                  </div>
               </div>
            </div>
            <div class="row">
               <div class="col-xs-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 q-pa-xs">
                  <q-input outlined v-model="birth_date" label="Nacimiento" clearable clear-icon="close" readonly>
                     <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                           <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                              <q-date v-model="birth_date" :default-year-month="default_date" @input="() => $refs.qDateProxy.hide()" :locale="locale">
                              </q-date>
                           </q-popup-proxy>
                        </q-icon>
                     </template>
                  </q-input>
                  <div class="text-subtitle2 text-red" v-for="error in errors.birth_date" :key="error">
                     {{error}}
                  </div>
               </div>
            </div>
            <div class="row">
               <q-btn color="secondary" class="q-ma-xs" label="Guardar Cambios" :loading="loading" @click="saveUser" icon-right="save" />
            </div>
         </q-card-section>
         <password ref="change_password"></password>
      </q-card>
   </q-page>
</template>

<script>
import {mapActions, mapState, mapGetters} from 'vuex'
export default {
   components:{
		'password':require('components/User/Password.vue').default,
   },
   
   data(){
      return{
         //Utils
         loading:false,
         errors:{},
         //Data
         initials:'',
         name:'',
         last_name:'',
         email:'',
         username:'',
         phone:'',
         office:'',
         birth_date:'',
         default_date:'',
         //Image
         loading_avatar:false,
         selectedFile:null,
         new_image:'',
         locale: {
         /* starting with Sunday */
            days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
            daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
            months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
            monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
            firstDayOfWeek: 1
         }
      }
   },

   computed:{
      ...mapState('auth', ['user_data']),
   },

   created(){
      this.getStoreData()
   },
   
   methods:{
      ...mapActions('auth', ['storeUserData', 'storeUserDataIndividual', 'checkIfAuthenticated', 'LogoutUser', 'updateImage']),
      async getStoreData(){
         await this.$axios.get(`${process.env.API}/userResource`)
			.then(res => {
            
            this.storeUserData(res.data.user)
            this.initials = res.data.user.initials
            this.name = res.data.user.name
            this.last_name = res.data.user.last_name
            this.email = res.data.user.email
            this.username = res.data.user.username
            this.phone = res.data.user.phone
            this.office = res.data.user.office
            this.birth_date = res.data.user.birth_date
            if(res.data.user.birth_date){
               let date = res.data.user.birth_date.split('-')
               let year = date[0]
               let month = date[1]
               this.default_date = `${year}/${month}`
            }
            else{
               let date = new Date().toISOString().substr(0, 10).split('-')
               let year = date[0]
               let month = date[1]
               this.default_date = `${year}/${month}`
            }
         })
         .catch(error => {
				// this.logOut()
				this.checkIfAuthenticated()
         })
      },

      saveUser(){
         this.loading = true
         let formData = {
            name:this.name,
            last_name:this.last_name,
            initials:this.initials,
            email:this.email,
            username:this.username,
            phone:this.phone,
            office:this.office,
            birth_date:this.birth_date,
            user_data:1
         }
         this.$axios.post(`${process.env.API}/user/update`, formData)
         .then(res => {
            this.errors = {}
            this.loading = false
            this.storeUserDataIndividual(formData)
            this.$q.notify({
               message:'Se actualizó el usuario',
               color:'positive',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
         .catch(error => {
            this.errors = error.response.data.errors
            this.loading = false
            this.$q.notify({
               message:'No se guardaron los datos de usuario, revise los errores en el formulario',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
      },

      changePassword(){
         this.$refs.change_password.changePassword()
      },

      inactivateAccount(){
         this.inactivate_dialog = true
         this.inactivate_password = ''
      },

      confirmInactivation(){
         this.$refs.inactivate_password.validate()
         if(!this.$refs.inactivate_password.hasError){
            this.inactivate_loading = true
            this.$axios.post(`${process.env.API}/user/inactivate-account`, {password:this.inactivate_password})
            .then(success => {
               this.$q.notify({
                  message:'Se inactivó la cuenta',
                  color:'positive',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
               this.inactivate_loading = false
               this.inactivate_dialog = false
               this.inactivate_password = ''
               this.LogoutUser()
            })
            .catch(error => {
               if(error.response.data.success == false){
                  this.inactivate_loading = false
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
                  this.inactivate_loading = false
                  this.$q.notify({
                     message:'No se pudo inactivar la cuenta',
                     color:'negative',
                     actions: [
                        { label: 'Cerrar', color: 'white', handler: () => {  } }
                     ]
                  })
               }
            })
         }
         else{
            this.inactivate_loading = false
            this.$q.notify({
               message:'No se pudo inactivar la cuenta',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         }
      },

      CancelImage(){
         this.new_image = ''
         this.selectedFile = null
         let fileSelected = document.getElementsByClassName('fileSelected')
         fileSelected[0].value = ''
      },

      pickFile(){
         this.$refs.fileSelected.click();
      },

      onFileSelected(event){
         const files = event.target.files;
         this.selectedFile = event.target.files[0];
         let filename = files[0].name;
         let size = files[0].size;

         if(!filename){
            this.CancelImage()
            return;
         }

         if(size > 2000000){
            this.$q.notify({
               message:'Archivo demasiado pesado. El límite es de 2mb',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
            this.CancelImage()
            return;
         }

         const fileReader = new FileReader();
         fileReader.addEventListener('load', () => {
            this.new_image = fileReader.result;
         })
         fileReader.readAsDataURL(files[0]);
      },

      UploadImage(){
         this.loading_avatar = true
         let data = new FormData()
         data.append('image', this.selectedFile, this.selectedFile.name)
         const config = {
            headers: {'content-type': 'multipart/form-data'}
         }
         this.$axios.post(`${process.env.API}/user/updateImage`, data, config)
         .then(res => {
            this.loading_avatar = false
            this.updateImage(res.data)
            this.$q.notify({
               message:'Se actualizó la imagen de perfil',
               color:'positive',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
            this.CancelImage()
         })
         .catch(error => {
            this.loading_avatar = false
            this.CancelImage()
            this.$q.notify({
               message:'No se pudo guardar la imagen, revise los errores en el formulario',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         });
      }
   }
}
</script>