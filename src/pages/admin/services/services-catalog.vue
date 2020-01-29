<template>
   <q-page padding>
      <div class="row">
         <div class="text-h5">Catálogo de servicios</div>
         <q-space/>
         <q-breadcrumbs class="align-right">
            <q-breadcrumbs-el label="Dashboard" icon="dashboard" to="/admin" />
            <q-breadcrumbs-el label="Catálogo de servicios" icon="chrome_reader_mode" />
         </q-breadcrumbs>
      </div>
      <q-card class="q-mt-md">
         <q-card-section>
            <div class="row">
               <q-btn label="Agregar Servicio" icon-right="add" color="primary" @click="addService" />
               <q-space />
               <q-btn round push color="grey" icon="sync" @click="Reload"/>
            </div>
         </q-card-section>
         <q-card-section>
            <q-markup-table wrap-cells>
               <thead>
                  <tr>
                     <th class="text-left" style="width:10%">Clave</th>
                     <th class="text-left" style="width:28%">Servicio</th>
                     <th class="text-left" style="width:20%">Bitácora</th>
                     <th class="text-center" style="width:5%">Moneda</th>
                     <th class="text-center" style="width:12%">Precio</th>
                     <th class="text-center" style="width:5%">Servicios</th>
                     <th class="text-center" style="width:10%">Status</th>
                     <th class="text-right" style="width:10%"></th>
                  </tr>
               </thead>
               <tbody>
                  <tr v-for="(reg, index) in services" :key="index">
                     <td>{{ reg.code }}</td>
                     <td>{{ reg.service }}</td>
                     <td>{{ reg.binnacle }}</td>
                     <td class="text-center">{{ reg.money_code }}</td>
                     <td class="text-right">{{ formatPrice(reg.price) }}</td>
                     <td class="text-center">{{ reg.services }}</td>
                     <td class="text-center">
                        <q-chip v-if="reg.status == 1" color="positive" dark label="Activo"/>
                        <q-chip v-else dark color="negative" label="Inactivo"/>
                     </td>
                     <td class="text-right">
                        <q-btn color="grey" icon="menu">
                           <q-badge v-if="reg.requisites > 0" color="secondary" floating>{{reg.requisites}}</q-badge>
                           <q-badge v-if="reg.requisites == 0" color="negative" floating>{{reg.requisites}}</q-badge>
                           <q-menu>
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
                                 <q-item v-if="reg.status == 1" clickable v-ripple class="text-red" @click="editStatus(index, reg.status)">
                                    <q-item-section avatar>
                                       <q-icon name="block" />
                                    </q-item-section>
                                    <q-item-section>
                                       Inactivar
                                    </q-item-section>
                                 </q-item>
                                 <q-item v-else clickable v-ripple class="text-green" @click="editStatus(index, reg.status)">
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
                  <tr>
                     <td style="width:100%" colspan="8">
                        <infinite-loading class="text-center" spinner="spiral" @infinite="infiniteScroll" ref="infiniteLoading">
                           <div slot="no-more">Ya no hay más registros</div>
                           <div slot="no-results">Se llegó al final de los resultados</div>
                        </infinite-loading>
                     </td>
                  </tr>
               </tbody>
            </q-markup-table>
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
         columns:[
            {name:'Clave', label:'Clave', align:'left', field:'code', sortable:true},
            {name:'Servicio', label:'Servicio', align:'left', field:'service', sortable:true},
            {name:'Bitácora', label:'Bitácora', align:'left', field:'binnacle', sortable:true},
            {name:'Moneda', label:'Moneda', align:'left', field:'money_code', sortable:true},
            {name:'Clave', label:'Clave', align:'left', field:'code', sortable:true},
            {name:'Clave', label:'Clave', align:'left', field:'code', sortable:true},
            {name:'Clave', label:'Clave', align:'left', field:'code', sortable:true},
         ],
         loading_table:false,
         loading:false,
         search_table:'',
         page:1,
         title:'',
         catalog_selected:'',
         services_catalog_id:'',
         status_dialog:false,
         service_status:'',
         timeout: 6000,
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
      this.loading_table = true;
      await this.$axios.post(this.url, {search:this.search_table})
      .then(res => {
         this.$q.loading.hide()
         this.services = res.data.data;
         this.loading_table = false;
      })
      .catch(error => {
         this.$q.loading.hide()
         this.loading_table = false;
      })
   },

   infiniteScroll($state){
      setTimeout(() => {
         this.page++
         this.$axios.post(this.url, {search:this.search_table})
         .then( res => {

            let services = res.data.data;

            if(services.length > 0){
               this.services = this.services.concat(services);
               $state.loaded()
            }
            else{
               $state.complete()
            }
         })
         .catch(error => {

         })
      }, 500);
   },

   clearSearch(){
      this.search_table = '';
      this.services = {};
      this.page = 1;
      this.$refs.infiniteLoading.stateChanger.reset();
      this.Load();
   },

   Reload(){
      this.services = {};
      this.page = 1;
      this.$refs.infiniteLoading.stateChanger.reset();
      this.Load();
   },
   
   formatPrice(value) {
      let val = (value/1).toFixed(2).replace('.,', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
   },

   addService(){
      this.$refs.services_form.addService();
   },

   editService(index){
      const service = this.services[index];
      this.catalog_selected = index;
      var service_id = service.id;
      this.$refs.services_form.editService(service_id);
   },

   openProcess(index){
      const service = this.services[index];
      var service_id = service.id;
      this.catalog_selected = index;
      this.$refs.process_form.openProcess(service_id)
   },

   newService(data){
      this.services.unshift(data);
   },

   updateService(data){
      // this.services[this.catalog_selected] = data;
      this.services.splice(this.catalog_selected,1,data);
      this.catalog_selected = '';
   },

   editStatus(index, value){
      const service = this.services[index];
      this.catalog_selected = index;
      this.services_catalog_id = service.id;
      this.service_status = value;
      this.status_dialog = true;
      if(value == 1){
         this.title = 'Desactivar registro';
      }
      else if(value == 0){
         this.title = 'Activar registro';
      }
   },

   async changeStatus(){
      this.loading = true;
      await this.$axios.put(`/api/catalog/status/${this.services_catalog_id}`, {status:this.service_status})
      .then(res => {
         this.services[this.catalog_selected] = res.data;
         this.snackbar = true;
         this.snackColor = 'info';
         this.snackText = 'Se cambió el estatus del servicio';
         this.timeout = 1500;
         this.catalog_selected = '';
         this.services_catalog_id = '';
         this.service_status = '';
         this.loading = false;
         this.status_dialog = false;
      })
      .catch(error => {
         this.snackbar = true;
         this.snackColor = 'error';
         this.snackText = 'No se pudo cambiar el estatus, inténtelo de nuevo o refresque la página.';
         this.timeout = 1500;
         this.loading = false;
         this.status_dialog = false
      })
   }, 

   updateProcess(data){
      this.services[this.catalog_selected].requisites = data;
      // this.catalog_selected = '';
   }
   } 
   
}
</script>