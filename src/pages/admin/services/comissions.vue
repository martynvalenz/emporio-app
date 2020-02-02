<template>
   <q-page padding>
      <div class="row">
         <div class="text-h5">Comisiones</div>
         <q-space/>
         <q-breadcrumbs class="align-right">
            <q-breadcrumbs-el label="Dashboard" icon="dashboard" to="/admin" />
            <q-breadcrumbs-el label="Comisiones" icon="money" />
         </q-breadcrumbs>
      </div>
      <q-card class="q-mt-md">
         <q-card-section>
            <div class="row">
               <q-btn label="Agregar Servicio" icon-right="add" color="secondary" class="q-mx-xs" @click="addService" />
               <q-btn label="Ver catálogo" icon-right="chrome_reader_mode" color="primary" class="q-mx-xs" to="/admin/services/catalog" />
               <q-space />
               <q-btn round push color="grey" icon="sync" @click="Reload"/>
            </div>
         </q-card-section>
         <q-card-section>
            <div class="row">
               <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 q-pa-xs">
                  <q-input v-model="search_table" label="Búsqueda" outlined v-on:keyup.enter="Reload">
                     <template v-slot:prepend>
                        <q-icon name="search" />
                     </template>
                     <template v-slot:append>
                        <q-icon name="close" @click="clearSearch" class="cursor-pointer" />
                     </template>
                  </q-input>
               </div>
            </div>
         </q-card-section>
         <q-card-section>
            <q-markup-table wrap-cells>
               <thead>
                  <tr>
                     <th class="text-left" style="width:10%">Clave</th>
                     <th class="text-left" style="width:25%">Servicio</th>
                     <th class="text-center" style="width:5%">Moneda</th>
                     <th class="text-center" style="width:12%">Precio</th>
                     <th class="text-center" style="width:7%">Venta</th>
                     <th class="text-center" style="width:7%">Gestión</th>
                     <th class="text-center" style="width:7%">Operativa</th>
                     <th class="text-center" style="width:7%">Status</th>
                     <th class="text-right" style="width:10%"></th>
                  </tr>
               </thead>
               <tbody>
                  <tr v-for="(reg, index) in services" :key="index">
                     <td>{{ reg.code }}</td>
                     <td>{{ reg.service }}</td>
                     <td class="text-center">{{ reg.money_code }}</td>
                     <td class="text-right">{{ formatPrice(reg.price) }}</td>
                     <td class="text-right" v-if="reg.sales == 0" :title="Math.round(reg.sales_comission_ammount)"><b class="text-red">%</b>{{ formatPrice(reg.sales_comission) }}</td>
                     <td class="text-right" v-else><b class="text-green">$</b>{{ formatPrice(reg.sales_comission) }}</td>
                     <td class="text-right" v-if="reg.management == 0" :title="Math.round(reg.management_comission_ammount)"><b class="text-red">%</b>{{ formatPrice(reg.management_comission) }}</td>
                     <td class="text-right" v-else><b class="text-green">$</b>{{ formatPrice(reg.management_comission) }}</td>
                     <td class="text-right" v-if="reg.operations == 0" :title="Math.round(reg.operations_comission_ammount)"><b class="text-red">%</b>{{ formatPrice(reg.operations_comission) }}</td>
                     <td class="text-right" v-else><b class="text-green">$</b>{{ formatPrice(reg.operations_comission) }}</td>
                     <td class="text-center">
                        <q-chip v-if="reg.status == 1" color="positive" dark label="Activo"/>
                        <q-chip v-else dark color="negative" label="Inactivo"/>
                     </td>
                     <td class="text-right">
                        <q-btn color="grey" icon="menu" flat>
                           <q-badge v-if="reg.requisites > 0" color="secondary" floating>{{reg.requisites}}</q-badge>
                           <q-badge v-if="reg.requisites == 0" color="negative" floating>{{reg.requisites}}</q-badge>
                           <q-menu auto-close>
                              <q-list>
                                 <q-item clickable @click="openProcess(index)" v-ripple >
                                    <q-item-section avatar>
                                       <q-icon name="list" />
                                    </q-item-section>
                                    <q-item-section>
                                       Check List
                                    </q-item-section>
                                 </q-item>
                                 <q-item clickable @click="editService(index)" v-ripple class="text-orange">
                                    <q-item-section avatar>
                                       <q-icon name="edit" />
                                    </q-item-section>
                                    <q-item-section>
                                       Editar
                                    </q-item-section>
                                 </q-item>
                                 <q-item v-if="reg.status == 1" clickable v-ripple class="text-red" @click="changeStatus(index, reg.status)">
                                    <q-item-section avatar>
                                       <q-icon name="block" />
                                    </q-item-section>
                                    <q-item-section>
                                       Inactivar
                                    </q-item-section>
                                 </q-item>
                                 <q-item v-else clickable v-ripple class="text-green" @click="changeStatus(index, reg.status)">
                                    <q-item-section avatar>
                                       <q-icon name="check" />
                                    </q-item-section>
                                    <q-item-section>
                                       Activar
                                    </q-item-section>
                                 </q-item>
                              </q-list>
                           </q-menu>
                        </q-btn>
                     </td>
                  </tr>
               </tbody>
            </q-markup-table>
            <infinite-loading class="text-center  q-pt-md" spinner="spiral" @infinite="infiniteScroll" ref="infiniteLoading">
               <div slot="no-more">Ya no hay más registros</div>
               <div slot="no-results">Se llegó al final de los resultados</div>
            </infinite-loading>
         </q-card-section>
         <q-card-section>
            <Catalog :service_dialog="1" ref="services_form" v-on:newService="newService($event)" v-on:updateService="updateService($event)"></Catalog>
		      <Process ref="process_form" v-on:updateProcess="updateProcess($event)"></Process>
         </q-card-section>
      </q-card>
   </q-page>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import Catalog from 'components/Catalog'
import Process from 'components/Process'
export default {
   meta () {
      return {
         title: 'Emporio - Catálogo de servicios'
      }
   },

   components:{Catalog, Process, InfiniteLoading},
   
   data(){
      return{
         //Data
         services:[],
         loading_table:false,
         loading:false,
         search_table:'',
         page:1,
         title:'',
         catalog_selected:'',
         services_catalog_id:'',
         status_dialog:false,
         service_status:'',
      }
   },
	
	computed: {
		url(){
			return `${process.env.API}/catalogs?page=${this.page}`
		}
	},

	created(){
      this.Load();
	},

   methods:{
      async Load(){
         this.$q.loading.show()
         this.loading_table = true
         await this.$axios.post(this.url, {search:this.search_table})
         .then(res => {
            this.$q.loading.hide()
            this.services = res.data.data
            this.loading_table = false
         })
         .catch(error => {
            this.$q.loading.hide()
            this.loading_table = false
         })
      },

      infiniteScroll($state){
         setTimeout(() => {
            this.page++
            this.$axios.post(this.url, {search:this.search_table})
            .then( res => {

               let services = res.data.data

               if(services.length > 0){
                  this.services = this.services.concat(services)
                  $state.loaded()
               }
               else{
                  $state.complete()
               }
            })
            .catch(error => {

            })
         }, 500)
      },

      clearSearch(){
         this.search_table = ''
         this.services = {}
         this.page = 1
         this.$refs.infiniteLoading.stateChanger.reset()
         this.Load()
      },

      Reload(){
         this.services = {}
         this.page = 1
         this.$refs.infiniteLoading.stateChanger.reset()
         this.Load()
      },
      
      formatPrice(value) {
         let val = (value/1).toFixed(2).replace('.,', '.')
         return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      },

      addService(){
         this.$refs.services_form.addService()
      },

      editService(index){
         const service = this.services[index]
         this.catalog_selected = index
         var service_id = service.id
         this.$refs.services_form.editService(service_id)
      },

      openProcess(index){
         const service = this.services[index]
         var service_id = service.id
         this.catalog_selected = index
         this.$refs.process_form.openProcess(service_id)
      },

      newService(data){
         this.services.unshift(data)
      },

      updateService(data){
         // this.services[this.catalog_selected] = data
         this.services.splice(this.catalog_selected,1,data)
         this.catalog_selected = ''
      },

      async changeStatus(index, value){
         this.loading = false
         const service = this.services[index]
         this.catalog_selected = index
         this.services_catalog_id = service.id
         this.service_status = value
         await this.$axios.put(`${process.env.API}/catalog/status/${this.services_catalog_id}`, {status:this.service_status})
         .then(res => {
            this.services.splice([this.catalog_selected], 1, res.data)
            this.catalog_selected = ''
            this.services_catalog_id = ''
            this.service_status = ''
            this.loading = false
            this.$q.notify({
               message:'Se actualizó el estatus del servicio',
               color:'positive',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
         .catch(error => {
            this.$q.notify({
               message:'No se pudo cambiar el estatus, inténtelo más tarde',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
            this.loading = false
         })
      }, 

      updateProcess(data){
         this.services[this.catalog_selected].requisites = data
         // this.catalog_selected = ''
      }
   } 
}
</script>