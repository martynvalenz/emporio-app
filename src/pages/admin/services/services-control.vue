<template>
   <q-page padding>
      <div><Progress ref="process_form" v-on:updateProgress="updateProgress($event)"></Progress></div>
      <div class="row">
         <div class="text-h5">Control de servicios</div>
         <q-space/>
         <q-breadcrumbs class="align-right">
            <q-breadcrumbs-el label="Dashboard" icon="dashboard" to="/admin" />
            <q-breadcrumbs-el label="Control de servicios" icon="business_center" />
         </q-breadcrumbs>
      </div>
      <q-card class="q-mt-md">
         <q-card-section>
            <div class="row">
               <q-btn label="Servicio" icon-right="add" color="blue-7" class="q-mx-xs" @click="addService" />
               <q-btn label="Paquete" icon-right="add" color="blue-8" class="q-mx-xs" @click="addPackage" />
               <q-btn label="Cliente" icon-right="person_add" color="blue-9" class="q-mx-xs" @click="createCustomer" />
               <q-btn label="Factura" icon-right="add" color="blue-10" class="q-mx-xs" @click="addBill" />
               <q-space />
               <!-- <q-btn-toggle push class="q-mx-sm" glossy toggle-color="primary" v-model="service_control_view"
                  :options="[
                     {value: 0, slot: 'cero'},
                     {value: 1, slot: 'one'}
                  ]">
                  <template v-slot:cero>
                     <q-icon name="view_headline" />
                     <q-tooltip>Lista</q-tooltip>
                  </template>
                  <template v-slot:one>
                     <q-icon name="view_day" />
                     <q-tooltip>Recuadro</q-tooltip>
                  </template>
               </q-btn-toggle> -->
               <q-btn round push color="grey" icon="sync" @click="Reload"/>
            </div>
         </q-card-section>
         <q-card-section>
            <div class="row">
               <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                  <q-select v-model="payed_status" label="Cobranza" outlined :options="payed_statuses" emit-value option-value="id" map-options option-label="status" @input="Reload" />
               </div>
               <div class="col-xs-12 col-sm-12 col-md-6 col-lg-5 col-xl-5 q-pa-xs">
                  <q-input v-model="search_table" label="Buscar servicio, marca o cliente..." outlined v-on:keyup.enter="Reload" v-on:keyup.esc="clearSearch">
                     <template v-slot:prepend>
                        <q-icon name="search" />
                     </template>
                     <template v-slot:append>
                        <q-icon name="close" @click="clearSearch" class="cursor-pointer" />
                     </template>
                  </q-input>
               </div>
               <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 q-pa-xs">
                  <q-input v-model="search_invoice" label="Buscar Factura/Recibo" outlined v-on:keyup.enter="Reload" v-on:keyup.esc="clearSearch">
                     <template v-slot:append>
                        <q-icon name="close" @click="clearSearch" class="cursor-pointer" />
                     </template>
                  </q-input>
               </div>
            </div>
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
                     <th class="text-left" style="width:14%">Fecha</th>
                     <th class="text-left" style="width:20%">Servicio</th>
                     <th class="text-left" style="width:15%">Cliente</th>
                     <th class="text-right" style="width:7%">Factura</th>
                     <th class="text-right" style="width:7%">Recibo</th>
                     <th class="text-center" style="width:10%">Precio</th>
                     <th class="text-center" style="width:6%">Resp</th>
                     <th class="text-center" style="width:8%">Cobranza</th>
                     <th class="text-center" style="width:8%">Trámite</th>
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
                     <td class="text-center">
                        <ul class="list-style: none;" v-for="(bill, index) in service.bills" :key="index">
                           <a class="text-green" @click="editFolio(bill.id)" v-if="service.is_payed == 2 && service.status < 3">{{bill.folio}}</a>
                           <a v-else @click="editFolio(bill.id)">{{bill.folio}}</a>
                        </ul>
                        <q-btn icon="add" color="primary" flat round size="sm" @click="createBill(index, 'Factura')" v-if="service.billed == 0 && service.status < 3"/>
                     </td>
                     <td class="text-center">
                        <ul class="list-style: none;" v-for="(receipt, index) in service.receipts" :key="index">
                           <a class="text-green" @click="editFolio(receipt.id)" v-if="service.is_payed == 2 && service.status < 3">{{receipt.folio}}</a>
                           <a @click="editFolio(receipt.id)" v-else>{{receipt.folio}}</a>
                        </ul>
                        <q-btn icon="add" color="primary" flat round size="sm" @click="createReceipt(index, 'Recibo')" v-if="service.billed == 0 && service.status < 3"/>
                     </td>
                     <td class="text-right" :title="'Facturado:'+formatPrice(service.billing)+' | Cobrado:'+formatPrice(service.charged)+' | Saldo:'+formatPrice(service.balance)">{{ formatPrice(service.final_price) }}</td>
                     <td class="text-center">{{ service.resp }}</td>
                     <!-- Payments -->
                     <td v-if="service.status < 3" class="text-center">
                        <q-chip v-if="service.is_payed == 1" size="sm" square color="orange" dark label="Pendiente">
                           <q-tooltip content-class="bg-blue-grey-10" content-style="font-size: 14px">
                              Facturado: {{formatPrice(service.billing)}} | Cobrado: {{formatPrice(service.charged)}} | Saldo: {{formatPrice(service.balance)}}
                           </q-tooltip>
                        </q-chip>
                        <q-chip v-if="service.is_payed == 2" size="sm" square dark color="positive" label="Pagado">
                           <q-tooltip content-class="bg-blue-grey-10" content-style="font-size: 14px">
                              Facturado: {{formatPrice(service.billing)}} | Cobrado: {{formatPrice(service.charged)}} | Saldo: {{formatPrice(service.balance)}}
                           </q-tooltip>
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
                     <!-- Status -->
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
            <Customer ref="customers_form" v-on:storeCustomer="storeCustomer($event)"></Customer>
            <Bill ref="bills_form" v-on:updateServices="Reload()" v-on:newBill="newBill($event)" v-on:updateBill="updateBill($event)" v-on:reloadBills="reloadBills"></Bill>
            <Bill ref="bills_form" v-on:updateServices="Reload()" v-on:newBill="newBill($event)" v-on:updateBill="updateBill($event)" v-on:reloadBills="reloadBills"></Bill>
         </q-card-section>
      </q-card>
   </q-page>
</template>

<script>
import Service from 'components/Service'
import Bill from 'components/Bill'
import Customer from 'components/Customer'
import Progress from 'components/Progress'
import InfiniteLoading from 'vue-infinite-loading'
import {mapActions, mapState} from 'vuex'
export default {
   meta() {
      return {
         title: 'Emporio - Control de servicios'
      }
   },

   components:{InfiniteLoading, Service, Customer, Bill, Progress},

   data(){
		return{
         //Data
			services:[],
			services_loading:false,
			search_table:'',
			search_invoice:'',
			selected_service:'',
			status:'todo',
			statuses:[],
			payed_status:'todo',
			payed_statuses:[],
			orderBy:'desc',
			page:1,
			service_control_view:0
		}
	},

	computed: {
		url(){
			return `${process.env.API}/services-control?page=${this.page}`
      },
      ...mapState('auth', ['user_data']),
	},

	created(){
		this.loadFilters()
		this.Load()
	},

	methods:{
		loadFilters(){
			this.payed_statuses = [
				{id:'todo', status:'Todo'},
				{id:1, status:'Pendiente'},
				{id:2, status:'Pagado'}
			]
			this.payed_status = 1

			this.statuses = [
				{id:'todo', status:'Todo'},
				{id:1, status:'Pendiente'},
				{id:2, status:'Terminado'},
				{id:3, status:'Cancelado'},
				{id:4, status:'No Registro'},
				{id:5, status:'Repetido'}
			]
			// this.status = 'todo'
			this.search_table = ''
			this.search_invoice = ''
			this.service_control_view = this.user_data.service_control
		},

		async Load(){
         this.$q.loading.show()
			this.services_loading = true
			await this.$axios.post(this.url, {search:this.search_table, invoice:this.search_invoice, status:this.status, payed_status:this.payed_status, orderBy:this.orderBy})
			.then(res => {
				this.services = res.data.data
            this.services_loading = false
            this.$q.loading.hide()
			})
			.catch(error => {
            this.services_loading = false 
            this.$q.loading.hide()
			})
		},

		infiniteScroll($state){
			setTimeout(() => {
				this.page++
				this.$axios.post(this.url, {search:this.search_table, invoice:this.search_invoice, status:this.status, payed_status:this.payed_status, orderBy:this.orderBy})
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
			this.loadFilters()
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
		
		formatPrice(value) {
			let val = (value/1).toFixed(2).replace('.,', '.')
			return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		},

		createCustomer(){
			this.$refs.customers_form.createCustomer()
      },
      
      storeCustomer(data){
         //Only for customers view
		},

		addService(){
			this.$refs.services_form.addService()
		},

		addPackage(){
			this.$refs.services_form.addPackage()
		},

		addBill(){
			this.$refs.bills_form.addBill(1)
      },

      newBill(data){
         //Only for bills view
      },
      
      updateBill(data){
         //Only for bills view
      },

      reloadBills(){
         //Only for bills view
      },
		
		createBill(index, type){
			const bill = this.services[index]
			let customer_id = bill.customer_id
			let customer = bill.customer
			this.$refs.bills_form.addBillAlready(customer_id, customer, type, 1)
		},
		
		createReceipt(index, type){
			const receipt = this.services[index]
			let customer_id = receipt.customer_id
			let customer = receipt.customer
			this.$refs.bills_form.addBillAlready(customer_id, customer, type, 1)
		},

		editFolio(id){
			this.$refs.bills_form.editBill(id, 1)
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
			// this.services[this.selected_service] = data
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

		showComments(index){
			const service = this.services[index]
			this.$refs.comments_dialog.showComments(service.id, '', 'service')
		},

		showComissions(index){
			const service = this.services[index]
			this.$refs.comissions_dialog.showComissions(service.id, 'service')
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