<template>
   <div>
      <q-dialog v-model="contacts_dialog" maximized persistent transition-show="slide-up" transition-hide="slide-down">
         <q-card>
            <q-bar class="bg-primary text-white">
               <div class="text-h6">Contactos</div>
               <q-space />
               <q-btn dense flat icon="close" v-close-popup>
                  <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
               </q-btn>
            </q-bar>
            <q-card-section>
               <div class="row">
                  <q-btn label="Agregar contacto" icon-right="person_add" color="primary" @click="createContact" class="q-ma-xs" />
                  <q-space />
                  <q-btn round push color="grey" icon="sync" @click="LoadContacts"/>
               </div>
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 q-pa-xs">
                     <q-select
                        outlined
                        v-model="search_contact"
                        use-input
                        behavior="menu"
                        label="Agregar contactos existentes..."
                        input-debounce="0"
                        :options="search_contacts"
                        clearable
                        emit-value option-value="id" map-options option-label="contact"
                        @filter="contactSelect"
                        >
                        <template v-slot:no-option>
                           <q-item>
                              <q-item-section class="text-grey">
                              No se encontraron resultados
                              </q-item-section>
                           </q-item>
                        </template>
                        <template v-slot:after>
                           <q-btn round dense flat icon="add" color="primary" @click="addKnownContact" :loading="searchLoading" />
                        </template>
                     </q-select>
                     <div class="text-subtitle2 text-red" v-for="error in errors.contact_id" :key="error">
                        {{error}}
                     </div>
                  </div>
               </div>
            </q-card-section>
            <q-card-section>
               <q-markup-table wrap-cells>
                  <thead>
                     <tr>
                        <th class="text-left" style="width:15%">Nombre</th>
                        <th class="text-left" style="width:15%">Puesto</th>
                        <th class="text-left" style="width:20%">Correo</th>
                        <th class="text-left" style="width:15%">Teléfono</th>
                        <!-- <th class="text-center" style="width:10%">Estatus</th> -->
                        <th class="text-center" style="width:10%">Agregado</th>
                        <th class="text-right" style="width:10%"></th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr v-for="(contact, index) in contacts" :key="index">
                        <td>
                           <span v-if="contact.title">{{ contact.title }}</span>
                           {{ contact.name }}
                        </td>
                        <td>{{ contact.position }}</td>
                        <td>{{ contact.email }}</td>
                        <td>
                           {{contact.phone}}
                           <span v-if="contact.extension">{{ contact.extension }}</span>
                        </td>
                        <!-- <td>
                           <div v-if="contact.has_access == 0">
                              <v-chip color="orange lighten-1" dark>sin Acceso</v-chip>
                           </div>
                           <div v-if="contact.has_access == 1">
                              <v-chip color="green" dark>con Acceso</v-chip>
                           </div>
                        </td> -->
                        <td>{{ contact.created_at }}</td>
                        <td class="text-right">
                           <q-btn round class="q-ma-xs" color="grey" icon="list" size="sm" @click="showContact(index)" />
                           <q-btn round class="q-ma-xs" color="orange" icon="edit" size="sm" @click="editContact(index)" />
                           <q-btn round class="q-ma-xs" color="negative" icon="block" size="sm" @click="deleteContact(index)" />
                        </td>
                     </tr>
                  </tbody>
               </q-markup-table>
            </q-card-section>
            <q-card-section>
               <q-dialog v-model="contact_dialog">
                  <q-card style="width:750px; max-width:95vw">
                     <q-form @submit.prevent="Save">
                        <q-card-section>
                           <div class="row">
                              <div class="text-h6">{{ dialog_title }}</div>
                              <q-space />
                              <q-btn icon="close" v-close-popup flat round />
                           </div>
                        </q-card-section>
                        <q-card-section>
                           <div class="row">
                              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 q-pa-xs">
                                 <q-input v-model="area" label="Área" outlined></q-input>
                                 <div class="text-subtitle2 text-red" v-for="error in errors.area" :key="error">
                                    {{error}}
                                 </div>
                              </div>
                              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 q-pa-xs">
                                 <q-input v-model="position" label="Puesto" outlined></q-input>
                                 <div class="text-subtitle2 text-red" v-for="error in errors.position" :key="error">
                                    {{error}}
                                 </div>
                              </div>
                           </div>
                           <div class="row">
                              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 q-pa-xs">
                                 <q-input v-model="title" label="Título (Ingeniero, licenciado, etc)" outlined></q-input>
                                 <div class="text-subtitle2 text-red" v-for="error in errors.title" :key="error">
                                    {{error}}
                                 </div>
                              </div>
                              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 q-pa-xs">
                                 <q-input v-model="name" label="Nombre *" outlined></q-input>
                                 <div class="text-subtitle2 text-red" v-for="error in errors.name" :key="error">
                                    {{error}}
                                 </div>
                              </div>
                           </div>
                           <div class="row">
                              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 q-pa-xs">
                                 <q-input v-model="email" label="Correo" type="email" outlined></q-input>
                                 <div class="text-subtitle2 text-red" v-for="error in errors.email" :key="error">
                                    {{error}}
                                 </div>
                              </div>
                              <div class="col-xs-8 col-sm-8 col-md-4 col-lg-3 col-xl-3 q-pa-xs">
                                 <q-input v-model="phone" label="Teléfono *" outlined mask="(###) ### - ####"></q-input>
                                 <div class="text-subtitle2 text-red" v-for="error in errors.phone" :key="error">
                                    {{error}}
                                 </div>
                              </div>
                              <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2 col-xl-2 q-pa-xs">
                                 <q-input v-model="extension" label="Ext." outlined></q-input>
                                 <div class="text-subtitle2 text-red" v-for="error in errors.extension" :key="error">
                                    {{error}}
                                 </div>
                              </div>
                           </div>
                           <div class="row">
                              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 q-pa-xs">
                                 <q-input v-model="comments" label="Comentarios (opcional)" type="textarea" outlined></q-input>
                                 <div class="text-subtitle2 text-red" v-for="error in errors.comments" :key="error">
                                    {{error}}
                                 </div>
                              </div>
                           </div>
                        </q-card-section>
                        <q-card-section>
                           <div class="row">
                              <q-space/>
                              <q-btn color="grey" label="Cerrar" v-close-popup class="q-ma-xs" />
                              <q-btn label="Guardar" icon-right="save" color="secondary" :loading="loading"  type="submit" class="q-ma-xs" />
                           </div>
                        </q-card-section>
                     </q-form>
                  </q-card>
               </q-dialog>
            </q-card-section>
            <q-card-section>
               <q-dialog v-model="dialog_description">
                  <q-card style="width:550px; max-width:95vw">
                        <q-card-section>
                           <div class="row">
                              <div class="text-h6">Datos de contacto</div>
                              <q-space />
                              <q-btn icon="close" v-close-popup flat round />
                           </div>
                        </q-card-section>
                        <q-card-section>
                           <div class="row">
                              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                 <p><b>Nombre: </b><span v-if="title">{{ title }} - </span><span>{{ name }}</span></p>
                              </div>
                              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                 <p><b>Correo: </b>{{ email }}</p>
                              </div>
                           </div>
                           <div class="row">
                              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                 <p><b>Área: </b>{{ area }}</p>
                              </div>
                              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                 <p><b>Puesto: </b>{{ position }}</p>
                              </div>
                           </div>
                           <div class="row">
                              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                 <p><b>Teléfono: </b>{{ phone }} <span v-if="extension">ext. {{ extension }}</span></p>
                              </div>
                           </div>
                           <div class="row">
                              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                 <p><b>Comentarios:</b></p>
								         <p>{{ comments }}</p>
                              </div>
                           </div>
                        </q-card-section>
                        <q-card-section>
                           <div class="row">
                              <q-space/>
                              <q-btn color="grey" label="Cerrar" v-close-popup class="q-ma-xs" />
                           </div>
                        </q-card-section>
                  </q-card>
               </q-dialog>
            </q-card-section>
         </q-card>
      </q-dialog>
   </div>
</template>

<script>
export default {
   data(){
      return {
         //snackbar
         snackbar: false,
         snackColor: '',
         snackText: '',
         timeout: 6000,
         //Contacts
         contacts_dialog: false,
         contacts: [],
         contacts_loading: false,
         customer_id: '',
         search_contact:'',
         search_contacts:[],
         searchLoading:false,
         known_contact:'',
         search: null,
         //Contact form
         errors:[],
         contact_dialog: false,
         dialog_title:'',
         loading: false,
         contact_id: '',
         position: '',
         title: '',
         area: '',
         name:'',
         email:'',
         phone:'',
         extension:'',
         comments:'',
         selected_contact:'',
         //Dialog description
         dialog_description:false
      }
	},

   methods:
   {
      //Contacts
      openContacts(customer_id)
      {
         this.contacts_dialog = true
         this.customer_id = customer_id
         this.LoadContacts(customer_id)
      },

      async LoadContacts(customer_id)
      {
         this.contacts_loading = true
         await this.$axios.get(`${process.env.API}/customer/contacts/${customer_id}`)
         .then(res =>
         {
            this.contacts = res.data
            this.contacts_loading = false
         })
         .catch(error =>
         {
            console.log(error)
            this.contacts_loading = false
         })
      },
      
      Load(){
         this.LoadContacts(this.customer_id)
      },

      contactSelect(val, update, abort){
         update(() => {
            this.$axios.post(`${process.env.API}/contacts/customer/list`, {customer_id:this.customer_id, search:val})
            .then(res => {
               this.search_contacts = res.data
            })
            .catch(error =>{
               console.log(error)
            })
         })
      },

      async addKnownContact(){
         this.searchLoading = true
         await this.$axios.post(`${process.env.API}/contacts/add-to-customer`, {customer_id:this.customer_id, contact_id:this.search_contact})
         .then(res => {
            this.searchLoading = false
            this.contacts.unshift(res.data)
            this.search_contact = ''
            this.search_contacts = {}
            this.$q.notify({
               message:'Se guardó el registro',
               color:'positive',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
         .catch(error => {
            this.searchLoading = false
            this.errors = error.response.data.errors
            this.$q.notify({
               message:'No se pudo guardar el registro, revise los errores en el formulario',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
      },

      showContact(index){
         this.dialog_description = true
         const contact = this.contacts[index]
         this.position = contact.position
         this.title = contact.title
         this.area = contact.area
         this.name =contact.name
         this.email =contact.email
         this.phone =contact.phone
         this.extension =contact.extension
         this.comments =contact.comments
      },

      clearContactForm()
      {
         this.contact_id = ''
         this.position = ''
         this.title = ''
         this.area = ''
         this.name =''
         this.email =''
         this.phone =''
         this.extension =''
         this.comments =''
         this.errors = {}
         this.selected_contact = ''
      },

      createContact(){
         if (this.customer_id == ''){
            this.contacts_dialog = false
         }
         else{
            this.contact_dialog = true
            this.dialog_title = 'Crear contacto'
            this.clearContactForm()
         }
      },

      editContact(index){
         this.contact_dialog = true
         const contact = this.contacts[index]
         this.selected_contact = index
         this.dialog_title = 'Editar contacto: '+contact.name
         this.contact_id = contact.id
         this.position = contact.position
         this.title = contact.title
         this.area = contact.area
         this.name =contact.name
         this.email =contact.email
         this.phone =contact.phone
         this.extension =contact.extension
         this.comments =contact.comments
         this.errors = {}
      },
      
      async Save(){
         this.loading = true
         //Update
         if(this.contact_id){
            await this.$axios.put(`${process.env.API}/customer/update/${this.contact_id}`, {position:this.position, title:this.title, area:this.area, name:this.name, email:this.email, phone:this.phone, extension:this.extension, comments:this.comments, customer_id:this.customer_id})
            .then(res => {
               this.loading = false
               this.contacts.splice(this.selected_contact, 1, res.data)
               this.contact_dialog = false
               this.clearContactForm()
               this.$q.notify({
                  message:'Se guardó el registro',
                  color:'positive',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
            })
            .catch(error => {
               this.loading = false
               this.errors = error.response.data.errors
               this.$q.notify({
                  message:'No se pudo guardar el registro, revise los errores en el formulario',
                  color:'negative',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
            })
         }
         //Store
         else{
            await this.$axios.post(`${process.env.API}/customer/contact`, {position:this.position, title:this.title, area:this.area, name:this.name, email:this.email, phone:this.phone, extension:this.extension, comments:this.comments, customer_id:this.customer_id})
            .then(res => {
               this.loading = false
               this.contacts.unshift(res.data)
               this.clearContactForm()
               this.contact_dialog = false
               this.$q.notify({
                  message:'Se guardó el registro',
                  color:'positive',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
            })
            .catch(error => {
               this.loading = false
               this.errors = error.response.data.errors
               this.$q.notify({
                  message:'No se pudo guardar el registro, revise los errores en el formulario',
                  color:'negative',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
            })
         }
      },

      deleteContact(index){
         const contact_to_delete = this.contacts[index]
         this.$axios.post(`${process.env.API}/customerContacts/delete/`, {customer_id:this.customer_id, contact_id:contact_to_delete.id})
         .then(res => {
            this.contacts.splice(index, 1)
            this.$q.notify({
               message:'Se eliminó el registro',
               color:'positive',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
         .catch(error => {
            console.log(error)
            this.$q.notify({
               message:'No se pudo eliminar el contacto, inténtelo más tarde',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
      }
   },
}
</script>