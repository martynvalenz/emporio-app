<template>
   <div>
      <q-dialog v-model="comissions_dialog" maximized persistent transition-show="slide-up" transition-hide="slide-down">
         <q-card>
            <q-bar class="bg-primary text-white">
               <div class="text-h6">{{title}}</div>
               <q-space />
               <q-btn dense flat icon="close" v-close-popup>
                  <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
               </q-btn>
            </q-bar>
            <q-card-section>
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-7 col-lg-6 col-xl-6">
                     <q-markup-table wrap-cells>
                        <thead>
                           <tr>
                              <th class="text-left" style="width:25%">Creado</th>
                              <th class="text-left" style="width:20%">Comisión</th>
                              <th class="text-right" style="width:20%">Utilizado</th>
                              <th class="text-right" style="width:20%">Disponible</th>
                              <th class="text-right" style="width:15%"><q-btn @click="getComis" flat round icon="sync"></q-btn></th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr v-for="(comis, index) in comissions_available" :key="index">
                              <td title="comis.id">{{ comis.created_at }}</td>
                              <td>
                                 <span v-if="comis.type == 0">Venta</span>
                                 <span v-if="comis.type == 1">Operativa</span>
                                 <span v-if="comis.type == 2">Gestión</span>
                              </td>
                              <td class="text-right">{{ formatPrice(comis.used) }}</td>
                              <td class="text-right">{{ formatPrice(comis.available) }}</td>
                              <td class="text-right">
                                 <q-btn size="sm" push round icon="send" color="positive" dark @click="selectComission(index)" />
                              </td>
                           </tr>
                        </tbody>
                     </q-markup-table>
                  </div>
               </div>
            </q-card-section>
            <q-card-section>
               <div class="row">
                  <div class="col-xs-12 q-pa-xs">
                     <div class="text-subtitle1">Asignar comisión</div>
                  </div>
               </div>
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 q-pa-xs">
                     <q-select outlined v-model="user_id" :options="users" label="Seleccionar usuario" emit-value option-value="id" map-options option-label="user" clearable />
                     <div class="text-subtitle2 text-red" v-for="error in errors.user_id" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-select outlined v-model="comission_type" :options="types" label="Tipo de comisión" emit-value option-value="type" map-options option-label="typer" readonly />
                     <div class="text-subtitle2 text-red" v-for="error in errors.comission_type" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input v-model="comission_percent" outlined label="Porcentaje" type="number" step="any" min="0" :max="available_percent" v-on:keyup="calculateAmmount" />
                     <div class="text-subtitle2 text-red" v-for="error in errors.comission_percent" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input v-model="ammount" outlined label="Monto" type="number" step="any" min="0" :max="available" v-on:keyup="calculatePercent" />
                     <div class="text-subtitle2 text-red" v-for="error in errors.ammount" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-checkbox v-model="apply_comissioner" color="primary" @input="ApplyComissioner" label="Aplicar 20%" :disable="!user_id" />
                  </div>
               </div>
               <div class="row" v-if="apply_comissioner">
                  <div class="col-xs-12 q-pa-xs">
                     <div class="text-subtitle1">20% Comisión</div>
                  </div>
               </div>
               <div class="row" v-if="apply_comissioner">
                  <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 q-pa-xs">
                     <q-select outlined v-model="comissioner_id" :options="users" label="Seleccionar usuario 20%" emit-value option-value="id" map-options option-label="user" clearable />
                     <div class="text-subtitle2 text-red" v-for="error in errors.comissioner_id" :key="error">
                        {{error}}
                     </div>
                  </div>
               </div>
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-7 col-lg-6 col-xl-6 q-pa-xs">
                     <q-input type="textarea" v-model="comments" outlined label="Comentarios" rows="3" autogrow />
                  </div>
               </div>
               <div class="row">
                  <div class="col-xs-12">
                     <q-btn label="Guardar" class="q-ma-xs" color="primary" icon-right="save" @click="Save" :loading="loading"/>
                     <q-btn label="Cancelar" class="q-ma-xs" color="grey" icon-right="close" @click="Cancel" :loading="loading"/>
                  </div>
               </div>
            </q-card-section>
            <q-separator inset v-if="comissions.length > 0" />
            <q-card-section v-if="comissions.length > 0">
               <q-markup-table wrap-cells>
                  <thead>
                     <tr>
                        <th class="text-left" style="width:15%">Actualizada</th>
                        <th class="text-left" style="width:20%">Usuario</th>
                        <th class="text-left" style="width:11%">Tipo</th>
                        <th class="text-right" style="width:12%">Porcentaje</th>
                        <th class="text-right" style="width:12%">Comisión</th>
                        <th class="text-center" style="width:15%">Estatus</th>
                        <th class="text-right" style="width:15%"><q-btn @click="getComis" flat round icon="sync"/></th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr v-for="(comis, index) in comissions" :key="index">
                        <td title="comis.id">{{ comis.updated_at }}</td>
                        <td>{{ comis.name }} {{ comis.last_name }}</td>
                        <td>
                           <span v-if="comis.comission_type == 0">Venta</span>
                           <span v-if="comis.comission_type == 1">Operativa</span>
                           <span v-if="comis.comission_type == 2">Gestión</span>
                        </td>
                        <td class="text-right">{{formatPrice(comis.comission_percent)}}</td>
                        <td class="text-right">{{ formatPrice(comis.ammount) }}</td>
                        <td class="text-center">
                           <q-chip label="Pendiente" v-if="comis.status == 0" dark color="orange"/>
                           <q-chip label="Liberada" v-if="comis.status == 1" dark color="primary"/>
                           <q-chip label="Pagada" v-if="comis.status == 2" dark color="positive"/>
                           <q-chip label="Cancelada" v-if="comis.status == 3" dark color="negative"/>
                        </td>
                        <td class="text-right">
                           <q-btn size="sm" class="q-ma-xs" push round icon="edit" color="orange" dark @click="editComission(index)" v-if="comis.status < 1 && comis.modified == 0" disabled />
                           <q-btn size="sm" class="q-ma-xs" push round icon="close" color="negative" dark v-if="comis.status < 1 && comis.modified == 0" @click="DeleteComission(index)"/>
                        </td>
                     </tr>
                  </tbody>
               </q-markup-table>
            </q-card-section>
            <q-card-section style="background-color:rgba(0,0,0,0.1); color: white; position:fixed; bottom: 0; width:100%;">
               <div class="row">
                  <q-space/>
                  <q-btn color="grey" label="Cerrar" v-close-popup class="q-ma-xs" />
               </div>
            </q-card-section>
         </q-card>
      </q-dialog>
   </div>
</template>

<script>
export default {
   data(){
      return{
         title:'',
         comissions_dialog:false,
         from:'',
         comis_loading:false,
         loading:false,
         used_loading:false,
         comissions_available:[],
         comissions:[],
         service_control_id:'',
         errors:[],
         users:[],
         available_id:'',
         available:0,
         used:0,
         available_percent:0,
         comission_id:'',
         user_id:'',
         types:[
            {type:0, typer:'Venta'},
            {type:1, typer:'Operativa'},
            {type:2, typer:'Gestión'}
         ],
         selected_comi:'',
         comission_type:'',
         ready:0,
         ammount:0,
         comission_percent:0,
         comissioner_id:'',
         apply_comissioner:false,
         apply_ammount:0,
         comments:'',
         //snackbar
         snackbar: false,
         snackColor: '',
         snackText: '',
         timeout: 6000,
      }
   },

   methods:{
      showComissions(id, from){
         this.from = from
         this.comissions_dialog = true
         this.service_control_id = id
         this.title = 'Comisiones de servicio: ' + id
         this.getComis()
         this.getUsedComis()
         this.getUsers()
      },

      clearData(){
         this.errors = {}
         this.available_id = ''
         this.comission_id = ''
         this.comission_type = ''
         this.user_id = ''
         this.selected_comi = ''
         this.ammount = ''
         this.comission_percent = ''
         this.comissioner_id = ''
         this.apply_comissioner = false
         this.apply_ammount = ''
         this.comments = ''
         this.ready = 0
         this.available = 0
         this.used = 0
         this.available_percent = 0
      },

      async getComis(){
         this.comis_loading = true
         await this.$axios.get(`${process.env.API}/comissions-available/${this.service_control_id}`)
         .then(res => {
               this.comissions_available = res.data
               this.comis_loading = false
         })
      },

      async getUsedComis(){
         this.used_loading = true
         await this.$axios.get(`${process.env.API}/comissions-assigned/${this.service_control_id}`)
         .then(res => {
               this.comissions = res.data
               this.used_loading = false
         })
      },

      async getUsers(){
         await this.$axios.get(`${process.env.API}/responsables`)
         .then(res => {
               this.users = res.data
         })
      },

      ApplyComissioner(){
         if(!this.apply_comissioner){
            this.apply_comissioner = false
            this.comission_percent = 0
         }
      },

      selectComission(index){
         const comi = this.comissions_available[index]
         this.selected_comi = index
         this.comission_type = comi.type * 1
         this.comission_percent = comi.percent
         this.ammount = comi.available
         this.available_id = comi.id
         this.ready = comi.ready
         this.available = comi.available
         this.used = comi.used
         this.available_percent = comi.percent
      },

      calculateAmmount(){
         if(!this.comission_percent){
            this.ammount = 0
         }
         else if(this.available_percent < this.comission_percent || this.comission_percent <= 0){
            this.ammount = 0
         }
         else{
            this.ammount = Math.round(this.comission_percent * this.available /this.available_percent)
         }
      },

      calculatePercent(){
         if(!this.ammount){
            this.comission_percent = 0
         }
         else if(this.available < this.ammount || this.ammount <= 0){
            this.comission_percent = 0
         }
         else{
            this.comission_percent = Math.round(this.ammount * this.available_percent /this.available)
         }
      },

      Save(){
         this.loading = true
         if(this.apply_comissioner && this.comissioner_id == this.user_id){
            let text = 'No pueden ser los mismos usuarios el del 20% y el de la comisión normal.'
            this.errors.user_id = text
            this.errors.comissioner_id = text
            this.$q.notify({
               message:'NO se pudo guardar la comisión, revise los errores en el formulario.',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
            this.loading = false
         }
         else if(this.ammount > this.available){
            this.errors.ammount = 'El monto no puede ser mayor al monto disponible: '+this.available
            this.$q.notify({
               message:'NO se pudo guardar la comisión, revise los errores en el formulario.',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
            this.loading = false
         }
         else{
            this.SaveData()
         }
      },

      SaveData(){
         if(this.comission_id){
               
         }
         else{
            this.$axios.post(`${process.env.API}/comission/store`, {user_id:this.user_id, comission_type:this.comission_type, comission_percent:this.comission_percent, ammount:this.ammount, comments:this.comments, comissioner_id:this.comissioner_id, apply_comissioner:this.apply_comissioner, services_control_id:this.service_control_id, comission_id:this.available_id, ready:this.ready, available:this.available, used:this.used})
            .then(res => {
               this.$emit('updateComission')
               this.getUsedComis()
               this.getComis()
               this.clearData()
               this.$q.notify({
                  message:'Se guardó la comisión.',
                  color:'positive',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
               this.loading = false
            })
            .catch(error => {
               this.errors = error.response.data.errors
               this.$q.notify({
                  message:'NO se pudo guardar la comisión, revise los errores en el formulario.',
                  color:'negative',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
               this.loading = false
            })
         }
      },

      editComission(index){
         const comi = this.comissions[index]
         this.selected_comi = index
         this.comission_type = comi.comission_type
         this.comission_percent = comi.comission_percent
         this.ammount = comi.ammount
         this.available_id = comi.id
         this.ready = comi.ready
         this.available = comi.ammount
         this.used = comi.ammount
         this.available_percent = comi.comission_percent
         this.user_id = comi.user_id
         this.comments = comi.comments
      },

      DeleteComission(index){
         const comi = this.comissions[index]
         this.$axios.put(`${process.env.API}/comission/delete/${comi.id}`, {comission_id:comi.comission_id})
         .then(res => {
            this.getComis()
            this.getUsedComis()
            this.$emit('updateComission')
         })
         .catch(error => {
            this.$q.notify({
               message:'No se pudo eliminar la comisión, inténtelo más tarde.',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
      },

      Cancel(){
         this.clearData()
      },

      formatPrice(value) {
         let val = (value/1).toFixed(2).replace('.,', '.')
         return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      },
   }
}
</script>