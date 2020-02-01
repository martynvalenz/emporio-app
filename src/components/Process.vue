<template>
   <div>
      <q-dialog v-model="service_dialog" maximized persistent transition-show="slide-up" transition-hide="slide-down">
         <q-card>
            <q-bar class="bg-primary text-white">
               <div class="text-h6">Editar Proceso</div>
               <q-space />
               <q-btn dense flat icon="close" v-close-popup>
                  <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
               </q-btn>
            </q-bar>
            <q-card-section>
               <q-markup-table wrap-cells>
                  <thead>
                     <tr>
                        <th class="text-left" style="width:10%">Orden</th>
                        <th class="text-left" style="width:28%">Requisito</th>
                        <th class="text-left" style="width:15%">Categoría</th>
                        <th class="text-center" style="width:8%">Venta</th>
                        <th class="text-center" style="width:8%">Operaciones</th>
                        <th class="text-center" style="width:8%">Gestión</th>
                        <th class="text-center" style="width:8%">Registro</th>
                        <th class="text-center" style="width:10%">Creado</th>
                        <th class="text-right" style="width:5%"></th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr v-for="(reg, index) in service_requisites" :key="index">
                        <td>{{ index + 1 }} <!-- <span><v-icon>keyboard_arrow_up</v-icon><v-icon>keyboard_arrow_down</v-icon></span> --></td>
                        <td>{{ reg.requisite }}</td>
                        <td>
                           <span v-if="reg.category == 0">Dirección</span>
                           <span v-if="reg.category == 1">Jurídico</span>
                           <span v-if="reg.category == 2">Administración</span>
                           <span v-if="reg.category == 3">Gestión</span>
                           <span v-if="reg.category == 4">Operaciones</span>
                           <span v-if="reg.category == 5">Soporte</span>
                           <span v-if="reg.category == 6">Auditoría</span>
                           <span v-if="reg.category == 7">Ventas</span>
                        </td>
                        <td class="text-center">
                           <q-icon style="font-size:2em;" v-if="reg.sales == 1" color="positive" name="fiber_manual_record" />
                           <q-icon style="font-size:2em;" v-else color="grey" name="fiber_manual_record" @click="ChangeRegistrant(index, 'sales')" />
                        </td>
                        <td class="text-center">
                           <q-icon style="font-size:2em;" v-if="reg.operations == 1" color="positive" name="fiber_manual_record" />
                           <q-icon style="font-size:2em;" v-else color="grey" name="fiber_manual_record" @click="ChangeRegistrant(index, 'operations')" />
                        </td>
                        <td class="text-center">
                           <q-icon style="font-size:2em;" v-if="reg.management == 1" color="positive" name="fiber_manual_record" />
                           <q-icon style="font-size:2em;" v-else color="grey" name="fiber_manual_record" @click="ChangeRegistrant(index, 'management')" />
                        </td>
                        <td class="text-center">
                           <q-icon style="font-size:2em;" v-if="reg.register == 1" color="positive" name="fiber_manual_record" />
                           <q-icon style="font-size:2em;" v-else color="grey" name="fiber_manual_record" @click="ChangeRegistrant(index, 'register')" />
                        </td>
                        <td class="text-center">{{ reg.created_at }}</td>
                        <td class="text-right">
                           <q-icon style="font-size:2em;" color="negative" @click="deleteRequisite(index)" name="cancel" />
                        </td>
                     </tr>
                  </tbody>
               </q-markup-table>
            </q-card-section>
            <q-separator inset />
            <q-card-section>
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-7 col-lg-6 col-xl-6 q-pa-xs">
                     <q-input v-model="requisite" label="Proceso *" outlined></q-input>
                     <div class="text-subtitle2 text-red" v-for="error in errors.requisite" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 q-pa-xs">
                     <q-select outlined v-model="category" :options="categories" label="Área" emit-value option-value="value" map-options option-label="category" />
                     <div class="text-subtitle2 text-red" v-for="error in errors.category" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 q-pa-xs">
                     <q-checkbox v-model="status" label="Estatus" :true-value="1" :false-value="0" />
                     <div class="text-subtitle2 text-red" v-for="error in errors.status" :key="error">
                        {{error}}
                     </div>
                  </div>
               </div>
               <div class="row">
                  <q-btn label="Guardar" icon-right="save" color="positive" :loading="loading" @click="Save" class="q-mx-xs" />
                  <q-btn label="Cancelar" color="grey" @click="cancel" class="q-mx-xs" />
               </div>
            </q-card-section>
            <q-separator inset />
            <q-card-section>
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 q-pa-xs" v-for="(requirement, index) in requisites" :key="index">
                     <span v-if="requirement.category == 0">Dirección </span>
                     <span v-if="requirement.category == 1">Jurídico </span>
                     <span v-if="requirement.category == 2">Administración </span>
                     <span v-if="requirement.category == 3">Gestión </span>
                     <span v-if="requirement.category == 4">Operaciones </span>
                     <span v-if="requirement.category == 5">Soporte </span>
                     <span v-if="requirement.category == 6">Auditoría </span>
                     <span v-if="requirement.category == 7">Ventas </span>
                     <q-icon @click="edit(index)" :color="requirement.color" name="edit" style="font-size:1.5em;" />
                     <br>
                     <q-toggle :color="requirement.color" v-bind:class="[requirement.status == 0 ? 'inactive':'']" :value="requirement.selected" :true-value="1" :false-value="0" :label="requirement.requisite" append-icon="edit" @click:append="edit(index)" @input="Switch(index)" :disabled="requirement.status == 0" />
                  </div>
               </div>
            </q-card-section>
            <q-card-section class="q-ma-xl" />
            <q-card-section style="background-color:rgba(0,0,0,0.1); color: white; position:fixed; bottom: 0; width:100%;">
               <div class="row">
                  <q-space/>
                  <q-btn label="Cerrar" icon-right="close" color="grey" v-close-popup />
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
         //DAta
         service_dialog:false,
         loading:false,
         errors:[],
         selected_requirement:'',
         requirement_id:'',
         service_catalog_id:'',
         requisite:'',
         status:1,
         category:'',
         categories:[
               {value:0, category:'Dirección'},
               {value:1, category:'Jurídico'},
               {value:2, category:'Administración'},
               {value:3, category:'Gestión'},
               {value:4, category:'Operaciones'},
               {value:5, category:'Soporte'},
               {value:6, category:'Auditoría'},
               {value:7, category:'Ventas'},
         ],
         requisites:[],
         service_requisites:[],
      }
   },

   methods:{
      openProcess(service_id){
         this.service_dialog = true
         this.service_catalog_id = service_id
         this.getRequisites()
         this.serviceRequisites()
      },

      async getRequisites(){
         await this.$axios.get(`${process.env.API}/catalog-requisites/${this.service_catalog_id}`)
         .then(res => {
               this.requisites = res.data
         })
      },

      async serviceRequisites(){
         await this.$axios.get(`${process.env.API}/catalog-service-requisites/${this.service_catalog_id}`)
         .then(res => {
               this.service_requisites = res.data
         })
      },

      edit(index){
         const requisites = this.requisites[index]
         this.selected_requirement = index
         this.requirement_id = requisites.id
         this.requisite = requisites.requisite
         this.status = requisites.status
         this.category = requisites.category
      },

      cancel(){
         this.selected_requirement = ''
         this.requirement_id = ''
         this.requisite = ''
         this.status = 1
         this.category = ''
      },

      async Save(){
         this.loading = true
         if(this.requirement_id){
               await this.$axios.put(`${process.env.API}/catalog-requirement/update/${this.requirement_id}`, {requisite:this.requisite, category:this.category, status:this.status, services_catalog_id:this.service_catalog_id})
               .then(res => {
                  this.requisites[this.selected_requirement] = res.data.requi
                  this.errors = {}
                  this.cancel()
                  this.loading = false
               })
               .catch(error => {
                  this.errors = error.response.data.errors
                  this.loading = false
               })
         }
         else{
               await this.$axios.post(`${process.env.API}/catalog-requirement/store`, {requisite:this.requisite, category:this.category, status:this.status, services_catalog_id:this.service_catalog_id})
               .then(res => {
                  this.requisites.unshift(res.data.requi)
                  this.cancel()
                  this.errors = {}
                  this.loading = false
               })
               .catch(error => {
                  this.errors = error.response.data.errors
                  this.loading = false
               })
         }
      },

      async ChangeRegistrant(index, variable){
         const requi = this.service_requisites[index]
         await this.$axios.post(`${process.env.API}/catalog/requisite-save-option`, {id:requi.id, services_catalog_id:requi.services_catalog_id, variable:variable})
         .then(res => {
               this.serviceRequisites()
         })
         .catch(error => {
               console.log(error)
         })
      },

      async Switch(index){
         // console.log(this.requisites[index])
         const requi = this.requisites[index]
         let selected = 1
         if(requi.selected === 1){
               selected = 0
         }
         else if(requi.selected === 0){
               selected = 1
         }
         await this.$axios.put(`${process.env.API}/catalog-requisite/switch/${requi.id}`, {selected:selected, requirement_id:requi.id, services_catalog_id:this.service_catalog_id})
         .then(res => {
               this.serviceRequisites()
               this.requisites[index] = res.data.requi
               this.$emit('updateProcess', res.data.count)
         })
         .catch(error => {
               console.log(error)
         })
      },

      async deleteRequisite(index){
         const requi = this.service_requisites[index]
         let selected = 0
         await this.$axios.put(`${process.env.API}/catalog-requisite/switch/${requi.id}`, {selected:selected, requirement_id:requi.requirement_id, services_catalog_id:requi.services_catalog_id})
         .then(res => {
               this.service_requisites.splice(index, 1)
               this.$emit('updateProcess', res.data.count)
               this.getRequisites()
         })
         .catch(error => {
               console.log(error)
         })
      }
   }
}
</script>

<style lang="css">
   ul {
      list-style-type: none;
      
   }

   li{
      text-align: center !important;
      display:inline;
      padding-left: 5px;
      padding-right: 5px;
   }

   .inactive{
      text-decoration: line-through;
      font-style: italic;
      color:grey;
   }

    
</style>