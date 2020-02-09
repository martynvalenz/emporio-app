<template>
   <q-page padding>
      <div><Progress ref="process_form" v-on:updateProgress="updateProgress($event)"></Progress></div>
      <div class="row">
         <div class="text-h5">Bitácoras</div>
         <q-space/>
         <q-breadcrumbs class="align-right">
            <q-breadcrumbs-el label="Dashboard" icon="dashboard" to="/admin" />
            <q-breadcrumbs-el label="Bitácoras" icon="bookmarks" />
         </q-breadcrumbs>
      </div>
      <q-card class="q-mt-md">
         <q-card-section>
            <div class="row">
               <q-btn label="Servicio" icon-right="add" color="blue-7" class="q-mx-xs" @click="addService" />
               <q-btn label="Paquete" icon-right="add" color="blue-8" class="q-mx-xs" @click="addPackage" />
               <q-btn label="Cliente" icon-right="person_add" color="blue-9" class="q-mx-xs" @click="createCustomer" />
               <q-space />
               <q-btn round push color="grey" icon="sync" @click="Reload"/>
            </div>
         </q-card-section>
         <q-card-section>
            <div class="row">
               <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                  <q-select v-model="status" label="Trámite" outlined :options="statuses" emit-value option-value="id" map-options option-label="status" @input="Reload" />
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
            <q-btn-toggle push class="q-mx-sm" toggle-color="primary" v-model="binnacle_view" ripple
                  :options="[
                     {value: 1, slot: 'tramites'},
                     {value: 2, slot: 'estudios'},
                     {value: 3, slot: 'negativas'},
                     {value: 4, slot: 'titulos'},
                     {value: 5, slot: 'requisitos'},
                  ]" @click="toggleBinnacle">
               <template v-slot:tramites>
                  <q-icon name="create_new_folder" />
                  Trámites
                  <q-tooltip>Trámites nuevos</q-tooltip>
               </template>
               <template v-slot:estudios>
                  <q-icon name="search" />
                  Estudios
                  <q-tooltip>Estudios de Factibilidad</q-tooltip>
               </template>
               <template v-slot:negativas>
                  <q-icon name="block" color="negative" />
                  Negativas
                  <q-tooltip>Negativas</q-tooltip>
               </template>
               <template v-slot:titulos>
                  <q-icon name="unarchive" />
                  Requisitos
                  <q-tooltip>Requisitos y Objeciones</q-tooltip>
               </template>
               <template v-slot:requisitos>
                  <q-icon name="assignment_late" />
                  Títulos
                  <q-tooltip>Títulos y Certificados</q-tooltip>
               </template>
            </q-btn-toggle>
         </q-card-section>
         <q-card-section>
            <q-btn color="primary" flat @click="sortBy">
               <div class="row items-center no-wrap">
                  <q-icon v-if="orderBy == 'asc'" left small name="keyboard_arrow_up" />
                  <q-icon v-if="orderBy == 'desc'" left small name="keyboard_arrow_down" />
                  <div class="text-center">Ordenar por fecha</div>
               </div>
            </q-btn>
         </q-card-section>
         <q-card-section>
            <q-markup-table wrap-cells>
               <thead>
                  <tr>
                     <th class="text-left" style="width:15%">Fecha</th>
                     <th class="text-left" style="width:23%">Servicio</th>
                     <th class="text-left" style="width:15%">Cliente</th>
                     <th class="text-center" style="width:5%">Resp</th>
                     <th class="text-center" style="width:23%">Avance</th>
                     <th class="text-center" style="width:7%">Cobranza</th>
                     <th class="text-center" style="width:7%">Trámite</th>
                     <th class="text-right" style="width:5%"></th>
                  </tr>
               </thead>
               <tbody>
                  <tr v-for="(service, index) in services" :key="index">
                     <q-menu context-menu touch-position auto-close>
                        <q-list>
                           <q-item clickable @click="EditService(index)" v-ripple class="text-orange">
                              <q-item-section avatar>
                                 <q-icon name="edit" />
                              </q-item-section>
                              <q-item-section>
                                 Editar
                              </q-item-section>
                           </q-item>
                           <q-item clickable @click="CheckList(index)" v-ripple>
                              <q-item-section avatar>
                                 <q-icon name="list" />
                              </q-item-section>
                              <q-item-section>
                                 Proceso
                              </q-item-section>
                           </q-item>
                           <q-item clickable @click="showComments(index)" v-ripple>
                              <q-item-section avatar>
                                 <q-icon name="comment" />
                              </q-item-section>
                              <q-item-section>
                                 Comentarios
                              </q-item-section>
                           </q-item>
                           <q-item clickable @click="showComissions(index)" v-ripple>
                              <q-item-section avatar>
                                 <q-icon name="attach_money" color="positive" />
                              </q-item-section>
                              <q-item-section>
                                 Comisiones
                              </q-item-section>
                           </q-item>
                           <q-item clickable v-if="service.status > 2" @click="ServiceChangeStatus(index, 'success')" v-ripple class="text-green">
                              <q-item-section avatar>
                                 <q-icon name="check" />
                              </q-item-section>
                              <q-item-section>
                                 Activar
                              </q-item-section>
                           </q-item>
                           <q-item clickable v-else @click="ServiceChangeStatus(index, 'error')" v-ripple class="text-red">
                              <q-item-section avatar>
                                 <q-icon name="block" />
                              </q-item-section>
                              <q-item-section>
                                 Cancelar
                              </q-item-section>
                           </q-item>
                        </q-list>
                     </q-menu>
                     <td :title="service.id">{{ service.date }}</td>
                     <td>
                        {{ service.code }}<span v-if="service.brand"> - {{ service.brand }}</span><span v-if="service.class"> ({{service.class}})</span>
                     </td>
                     <td>{{ service.customer }}</td>
                     <td class="text-center">{{ service.resp }}</td>
                     <td @click="CheckList(index)">
                        <q-linear-progress v-if="service.advance_percent <= 50" size="25px" :value="service.advance_percent / 100" color="negative">
                           <div class="absolute-full flex flex-center">
                              <q-badge color="white" text-color="negative" :label="Math.ceil(service.advance_percent) + '%'" />
                           </div>
                        </q-linear-progress>
                        <q-linear-progress v-if="service.advance_percent > 50 && service.advance_percent < 99" size="25px" :value="service.advance_percent / 100" color="orange">
                           <div class="absolute-full flex flex-center">
                              <q-badge color="white" text-color="orange" :label="Math.ceil(service.advance_percent) + '%'" />
                           </div>
                        </q-linear-progress>
                        <q-linear-progress v-if="service.advance_percent >= 99" :value="service.advance_percent / 100" size="25px" color="positive">
                           <div class="absolute-full flex flex-center">
                              <q-badge color="white" text-color="positive" :label="Math.ceil(service.advance_percent) + '%'" />
                           </div>
                        </q-linear-progress>
                     </td>
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
                     <td v-else class="text-center">
                        <q-chip v-if="service.status == 3" size="sm" square dark color="negative" label="Cancelado"/>
                        <q-chip v-if="service.status == 4" size="sm" square dark color="negative" label="NoRegistro"/>
                        <q-chip v-if="service.status == 5" size="sm" square dark color="negative" label="Repetido"/>
                     </td>
                     <!-- Div -->
                     <td class="text-center">
                        <q-chip v-if="service.status == 1" size="sm" square dark color="orange" label="Pendiente"/>
                        <q-chip v-if="service.status == 2" size="sm" square dark color="positive" label="Terminado"/>
                        <q-chip v-if="service.status == 3" size="sm" square dark color="negative" label="Cancelado"/>
                        <q-chip v-if="service.status == 4" size="sm" square dark color="negative" label="NoRegistro"/>
                        <q-chip v-if="service.status == 5" size="sm" square dark color="negative" label="Repetido"/>
                     </td>
                     <td>
                        <q-btn color="grey" icon="menu" flat size="md">
                           <q-menu auto-close>
                              <q-list>
                                 <q-item clickable @click="EditService(index)" v-ripple class="text-orange">
                                    <q-item-section avatar>
                                       <q-icon name="edit" />
                                    </q-item-section>
                                    <q-item-section>
                                       Editar
                                    </q-item-section>
                                 </q-item>
                                 <q-item clickable @click="CheckList(index)" v-ripple>
                                    <q-item-section avatar>
                                       <q-icon name="list" />
                                    </q-item-section>
                                    <q-item-section>
                                       Proceso
                                    </q-item-section>
                                 </q-item>
                                 <q-item clickable @click="showComments(index)" v-ripple>
                                    <q-item-section avatar>
                                       <q-icon name="comment" />
                                    </q-item-section>
                                    <q-item-section>
                                       Comentarios
                                    </q-item-section>
                                 </q-item>
                                 <q-item clickable @click="showComissions(index)" v-ripple>
                                    <q-item-section avatar>
                                       <q-icon name="attach_money" color="positive" />
                                    </q-item-section>
                                    <q-item-section>
                                       Comisiones
                                    </q-item-section>
                                 </q-item>
                                 <q-item clickable v-if="service.status > 2" @click="ServiceChangeStatus(index, 'success')" v-ripple class="text-green">
                                    <q-item-section avatar>
                                       <q-icon name="check" />
                                    </q-item-section>
                                    <q-item-section>
                                       Activar
                                    </q-item-section>
                                 </q-item>
                                 <q-item clickable v-else @click="ServiceChangeStatus(index, 'error')" v-ripple class="text-red">
                                    <q-item-section avatar>
                                       <q-icon name="block" />
                                    </q-item-section>
                                    <q-item-section>
                                       Cancelar
                                    </q-item-section>
                                 </q-item>
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
            <Service ref="services_form" v-on:addService="newService($event)" v-on:updateService="updateService($event)"></Service>
            <ServiceStatus ref="service_cancel" v-on:updateService="updateService($event)"></ServiceStatus>
            <Customer ref="customers_form" v-on:storeCustomer="storeCustomer($event)"></Customer>
            <Comments ref="comments_dialog"></Comments>
            <Comissions ref="comissions_dialog" v-on:updateComission="updateComission"></Comissions>
         </q-card-section>
      </q-card>
   </q-page>
</template>

<script>
import Service from 'components/Service'
import ServiceStatus from 'components/ServiceStatus'
import Comments from 'components/Comments'
import Customer from 'components/Customer'
import Progress from 'components/Progress'
import Comissions from 'components/Comissions'
import InfiniteLoading from 'vue-infinite-loading'
import {mapActions} from 'vuex'
import {LocalStorage} from 'quasar'
export default {
   meta() {
      return {
         title: 'Emporio - Trámites Nuevos'
      }
   },

   components:{InfiniteLoading, Service, ServiceStatus, Customer, Progress, Comments, Comissions},

   data(){
		return{
			selected_service:'',
			//Data
			services:[],
			services_loading:false,
			search_table:'',
			status:'todo',
			statuses:[],
			orderBy:'desc',
			page:1,
			binnacle_view:''
		}
	},

	computed: {
		url(){
			return `${process.env.API}/binnacles-view?page=${this.page}`
      },
	},

	created(){
      this.binnacle_view = LocalStorage.getItem('binnacles')
		this.loadFilters()
		this.Load()
	},

	methods:{
      ...mapActions('auth', ['changeBinnacle']),
		loadFilters(){
			this.statuses = [
				{id:'todo', status:'Todo'},
				// {id:'vigente', status:'Vigentes'},
				{id:1, status:'Pendientes'},
				{id:2, status:'Terminados'},
				{id:3, status:'Cancelados'},
				{id:4, status:'No Registro'},
				{id:5, status:'Repetidos'}
			]
			this.status = 'todo'
         this.search_table = ''
		},

		async Load(){
         this.$q.loading.show()
			this.services_loading = true
			await this.$axios.post(this.url, {search:this.search_table, status:this.status, orderBy:this.orderBy, binnacle:this.binnacle_view})
			.then(res => {
            this.$q.loading.hide()
				this.services = res.data.data
				this.services_loading = false
			})
			.catch(error => {
            this.$q.loading.hide()
				this.services_loading = false 
			})
		},

		infiniteScroll($state){
			setTimeout(() => {
				this.page++
				this.$axios.post(this.url, {search:this.search_table, status:this.status, orderBy:this.orderBy, binnacle:this.binnacle_view})
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

		sortBy(){
			if(this.orderBy == 'desc'){
				this.orderBy = 'asc'
				this.Load()
			}
			else{
				this.orderBy = 'desc'
				this.Load()
			}
		},

		addCustomer(){
			this.$refs.customer_form.addCustomer()
		},

		addService(){
			this.$refs.services_form.addService()
		},

		addBill(){
			this.$refs.bills_form.addBill()
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

		newService(data){
			this.services.unshift(data)
		},

		EditService(index){
			const service = this.services[index]
			this.selected_service = index
			let service_id = service.id
			this.$refs.services_form.editService(service_id)
		},

		updateService(data){
			this.services[this.selected_service] = data
			this.services.splice(this.selected_service, 1, data)
			this.selected_service = ''
		}, 

		ServiceChangeStatus(index, color){
			const service = this.services[index]
			this.selected_service = index
			this.$refs.service_cancel.ServiceChangeStatus(service.id, color, service.status)
		},

		CheckList(index){
			this.selected_service = index
			const service = this.services[index]
			this.$refs.process_form.openProgress(service.id)
			
		},

		updateProgress(data){
			this.services.splice(this.selected_service, 1, data)
		},

		addPackage(){
			this.$refs.services_form.addPackage()
		},

		showComments(index){
			const service = this.services[index]
			this.$refs.comments_dialog.showComments(service.id, '', 'service')
		},

		showComissions(index){
			const service = this.services[index]
			this.$refs.comissions_dialog.showComissions(service.id, 'service')
      },

      updateComission(){
         //Comissions view
      },

      createCustomer(){
			this.$refs.customers_form.createCustomer()
      },

      storeCustomer(data){
         //Only for customers view
		},
      
      async toggleBinnacle(){
         await this.$axios.post(`${process.env.API}/user/changeBinnacle`, {binnacles:this.binnacle_view})
         .then(res =>{
            this.changeBinnacle({binnacles:this.binnacle_view})
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