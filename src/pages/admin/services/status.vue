<template>
   <q-page padding>
      <div class="row">
         <div class="text-h5">Estátus de Trámites</div>
         <q-space/>
         <q-breadcrumbs class="align-right">
            <q-breadcrumbs-el label="Dashboard" icon="dashboard" to="/admin" />
            <q-breadcrumbs-el label="Estátus de Trámites" icon="assignment" />
         </q-breadcrumbs>
      </div>
      <q-card class="q-mt-md">
         <q-card-section>
            <div class="row">
               <q-btn label="Servicio" icon-right="add" color="blue-7" class="q-mx-xs"  />
               <q-space />
               <q-btn round push color="grey" icon="sync" @click="Reload"/>
            </div>
         </q-card-section>
         <q-card-section>
            <div class="row">
               <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                  <q-select v-model="status" label="Estatus" outlined :options="statuses" emit-value option-value="id" map-options option-label="status" @input="Reload" />
               </div>
               <div class="col-xs-12 col-sm-12 col-md-6 col-lg-5 col-xl-5 q-pa-xs">
                  <q-input v-model="search_table" label="Buscar servicio, marca o cliente..." outlined v-on:keyup.enter="Reload" v-on:keyup.esc="clearSearch">
                     <template v-slot:prepend>
                        <q-icon name="search" @click="Reload" />
                     </template>
                     <template v-slot:append>
                        <q-icon name="close" @click="clearSearch" class="cursor-pointer" />
                     </template>
                  </q-input>
               </div>
            </div>
         </q-card-section>
         <q-card-section>
            <q-btn-toggle push class="q-mx-sm" toggle-color="primary" v-model="status_view" ripple
                  :options="[
                     {value: 'duso', slot: 'duso'},
                     {value: 1, slot: 'signos'},
                     {value: 2, slot: 'busqueda'},
                     {value: 3, slot: 'invenciones'},
                     {value: 4, slot: 'dictamen'},
                     {value: 5, slot: 'cbar'},
                     {value: 6, slot: 'obras'},
                     {value: 7, slot: 'reserva'},
                     {value: 8, slot: 'juicios'},
                     {value: 9, slot: 'franquicias'},
                  ]" @click="toggleBinnacle">
               <template v-slot:duso>
                  <i class="fas fa-exclamation-triangle"> </i>
                  <span class="q-pl-xs">DUSO</span>
                  <q-tooltip>Declaración de uso</q-tooltip>
               </template>
               <template v-slot:signos>
                  <i class="far fa-registered"> </i>
                  <span class="q-pl-xs">SD</span>
                  <q-tooltip>Signos distintivos</q-tooltip>
               </template>
               <template v-slot:busqueda>
                  <i class="fas fa-search"> </i>
                  <span class="q-pl-xs">BT</span>
                  <q-tooltip>Búsqueda Técnica</q-tooltip>
               </template>
               <template v-slot:invenciones>
                  <i class="fab fa-accusoft"> </i>
                  <span class="q-pl-xs">INV</span>
                  <q-tooltip>Invenciones</q-tooltip>
               </template>
               <template v-slot:dictamen>
                  <i class="fas fa-file-alt"></i>
                  <span class="q-pl-xs">DP</span>
                  <q-tooltip>Dictamen Previo</q-tooltip>
               </template>
               <template v-slot:cbar>
                  <i class="fas fa-barcode"></i>
                  <span class="q-pl-xs">CBAR</span>
                  <q-tooltip>Códigos de Barra</q-tooltip>
               </template>
               <template v-slot:obras>
                  <i class="fas fa-mosque"></i>
                  <span class="q-pl-xs">RO</span>
                  <q-tooltip>Registro de Obras</q-tooltip>
               </template>
               <template v-slot:reserva>
                  <i class="fas fa-balance-scale"></i>
                  <span class="q-pl-xs">RD</span>
                  <q-tooltip>Reserva de Derechos</q-tooltip>
               </template>
               <template v-slot:juicios>
                  <i class="fas fa-gavel"></i>
                  <span class="q-pl-xs">JU</span>
                  <q-tooltip>Juicios</q-tooltip>
               </template>
               <template v-slot:franquicias>
                  <i class="fas fa-store-alt"></i>
                  <span class="q-pl-xs">FRAN</span>
                  <q-tooltip>Franquicias</q-tooltip>
               </template>
            </q-btn-toggle>
         </q-card-section>
         <!-- <q-card-section>
            <q-btn color="primary" flat @click="sortBy">
               <div class="row items-center no-wrap">
                  <q-icon v-if="orderBy == 'asc'" left small name="keyboard_arrow_up" />
                  <q-icon v-if="orderBy == 'desc'" left small name="keyboard_arrow_down" />
                  <div class="text-center">Ordenar por fecha</div>
               </div>
            </q-btn>
         </q-card-section> -->
         <q-card-section>
            <q-markup-table wrap-cells>
               <thead>
                  <tr>
                     <th class="text-left" style="width:10%">Subcategoría</th>
                     <th class="text-left" style="width:15%">Cliente</th>
                     <th class="text-left" style="width:15%">Marca</th>
                     <th class="text-left" style="width:10%">Expediente</th>
                     <th class="text-left" style="width:10%">Registro</th>
                     <th class="text-center" style="width:15%">Estatus</th>
                     <th class="text-center" style="width:15%">
                        <span v-if="status_view == 'duso'">Declaración</span>
                        <span v-else>Vencimiento</span>
                     </th>
                     <th class="text-center" style="width:5%">Vigencia</th>
                     <th class="text-right" style="width:5%"></th>
                  </tr>
               </thead>
               <tbody>
                  <tr v-for="(service, index) in services" :key="index">
                     <q-menu context-menu touch-position auto-close>
                        <q-list>
                           <!-- <q-item clickable @click="EditService(index)" v-ripple class="text-orange">
                              <q-item-section avatar>
                                 <q-icon name="edit" />
                              </q-item-section>
                              <q-item-section>
                                 Editar
                              </q-item-section>
                           </q-item> -->
                        </q-list>
                     </q-menu>
                     <td>{{service.subcategory}}</td>
                     <td>{{ service.customer }}</td>
                     <td>{{ service.brand }}</td>
                     <td>{{service.case_file}}</td>
                     <td>{{service.registry}}</td>
                     <td>{{service.status}}</td>
                     <td class="text-center">
                        <span v-if="status_view == 'duso'">{{service.date_declaration}}</span>
                        <span v-else>{{service.date_expiration}}</span>
                     </td>
                     <td>Vigencia</td>
                     <td v-if="service.status < 3" class="text-center">
                        <q-chip v-if="service.is_payed == 1" size="sm" square color="orange" dark label="Pendiente">
                           <!-- <q-tooltip content-class="bg-blue-grey-10" content-style="font-size: 14px">
                              Facturado: {{formatPrice(service.billing)}} | Cobrado: {{formatPrice(service.charged)}} | Saldo: {{formatPrice(service.balance)}}
                           </q-tooltip> -->
                        </q-chip>
                        <q-chip v-if="service.is_payed == 2" size="sm" square dark color="positive" label="Pagado">
                           <!-- <q-tooltip content-class="bg-blue-grey-10" content-style="font-size: 14px">
                              Facturado: {{formatPrice(service.billing)}} | Cobrado: {{formatPrice(service.charged)}} | Saldo: {{formatPrice(service.balance)}}
                           </q-tooltip> -->
                        </q-chip>
                     </td>
                     <td>
                        <q-btn color="grey" icon="menu" flat size="md">
                           <q-menu auto-close>
                              <q-list>
                                 <!-- <q-item clickable @click="EditService(index)" v-ripple class="text-orange">
                                    <q-item-section avatar>
                                       <q-icon name="edit" />
                                    </q-item-section>
                                    <q-item-section>
                                       Editar
                                    </q-item-section>
                                 </q-item> -->
                              </q-list>
                           </q-menu>
                        </q-btn>
                     </td>
                  </tr>
               </tbody>
            </q-markup-table>
            <infinite-loading class="text-center q-pt-md" spinner="spiral" @infinite="infiniteScroll" ref="infiniteLoading">
               <div slot="no-more">Ya no hay más registros</div>
               <div slot="no-results">Se llegó al final de los resultados</div>
            </infinite-loading>
         </q-card-section>
         <q-card-section>

         </q-card-section>
      </q-card>
   </q-page>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import {mapActions} from 'vuex'
import {LocalStorage} from 'quasar'
export default {
   meta() {
      return {
         title: 'Emporio - Estatus de Trámites'
      }
   },

   components:{InfiniteLoading},

   data(){
		return{
			selected_service:'',
			//Data
			services:[],
			services_loading:false,
			search_table:'',
			status:'todo',
			statuses:[{id:'todo',status:'Todo'}],
			orderBy:'desc',
			page:1,
			status_view:''
		}
	},

	computed: {
		url(){
			return `${process.env.API}/status?page=${this.page}`
      },
	},

	created(){
      this.status_view = LocalStorage.getItem('status_view')
		this.loadFilters()
		this.Load()
	},

	methods:{
      ...mapActions('auth', ['changeStatus']),
		loadFilters(){
         this.search_table = ''
         this.loadStatuses()
      },
      
      async loadStatuses(){
         await this.$axios.get(`${process.env.API}/status/colors`)
         .then(res => {
            // this.statuses.concat(res.data)
            res.data.forEach((value, index) => {
               let data = []

               data = {id:value.id, status:value.status}
               this.statuses.push(data)
            })

         })
         .catch(error => {
            this.$q.notify({
               message:'No se pudieron cargar los filtros.',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
      },

		async Load(){
         this.$q.loading.show()
			this.services_loading = true
			await this.$axios.post(this.url, {search:this.search_table, status:this.status, status_view:this.status_view})
			.then(res => {
            this.$q.loading.hide()
				this.services = res.data.data
				this.services_loading = false
			})
			.catch(error => {
            this.$q.loading.hide()
            this.services_loading = false 
            this.$q.notify({
               message:'No se pudieron cargar los servicios.',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
			})
		},

		infiniteScroll($state){
			setTimeout(() => {
				this.page++
				this.$axios.post(this.url, {search:this.search_table, status:this.status, status_view:this.status_view})
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
               this.$q.notify({
                  message:'No se pudieron cargar los servicios.',
                  color:'negative',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
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

		async changeView(val){
			this.services_loading = true
			this.$axios.post(`${process.env.API}/user/services-control-view`, {service_control:val})
			.then(res => {
				this.$store.dispatch('auth/changeServicesControlView', {service_control:val})
				this.services_loading = false
			})
		},
      
      async toggleBinnacle(){
         await this.$axios.post(`${process.env.API}/user/changeStatus`, {status_view:this.status_view})
         .then(res =>{
            this.changeStatus({status_view:this.status_view})
            this.Reload()
         })
         .catch(error => {
            this.$q.notify({
               message:'No se pudo cambiar la bitácora, inténtelo más tarde.',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
         // console.log(this.binnacle_view)
      }
	}
}
</script>

<style lang="css">
	small{
		color: grey !important;
	}

	ul {
		list-style-type: none;
	}

	li{
		margin-left: -20px !important;
		text-align: left !important;
	}
</style>