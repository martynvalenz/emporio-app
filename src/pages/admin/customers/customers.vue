<template>
   <q-page padding>
      <div class="row">
         <div class="text-h5">Clientes <small># {{formatNumeric(customers_count)}}</small></div>
         <q-space/>
         <q-breadcrumbs class="align-right">
            <q-breadcrumbs-el label="Dashboard" icon="dashboard" to="/admin" />
            <q-breadcrumbs-el label="Clientes" icon="people_outline" />
         </q-breadcrumbs>
      </div>
      <q-card class="q-mt-md">
         <q-card-section>
            <div class="row">
               <q-btn label="Agregar Cliente" icon-right="person_add" color="secondary" @click="create" class="q-ma-xs" />
               <q-btn label="Agregar Estrategia" icon-right="add" color="primary" @click="createStrategy" class="q-ma-xs" />
               <q-space />
               <q-btn round push color="grey" icon="sync" @click="Reload"/>
            </div>
         </q-card-section>
         <q-card-section>
            <div class="row">
               <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 q-pa-xs">
                  <q-input v-model="search_customers" label="Búsqueda" outlined v-on:keyup.enter="Reload" v-on:keyup.esc="clearSearch">
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
                     <th class="text-left" style="width:35%">Cliente</th>
                     <th class="text-left" style="width:15%">Estrategia</th>
                     <th class="text-left" style="width:10%">Saldo</th>
                     <th class="text-center" style="width:5%">Usuario</th>
                     <th class="text-center" style="width:10%">Estatus</th>
                     <th class="text-center" style="width:15%">Agregado</th>
                     <th class="text-right" style="width:10%"></th>
                  </tr>
               </thead>
               <tbody>
                  <tr v-for="(customer, index) in customers" :key="index">
                     <td>{{ customer.customer }}</td>
                     <td>{{ customer.strategy }}</td>
                     <td>{{ customer.balance }}</td>
                     <td class="text-center">{{ customer.initials }}</td>
                     <td class="text-center">
                        <q-chip v-if="customer.status == 1" color="positive" dark label="Activo"/>
                        <q-chip v-else dark color="negative" label="Inactivo"/>
                     </td>
                     <td class="text-center">{{ customer.created_at }}</td>
                     <td class="text-right">
                        <q-btn color="grey" icon="menu" flat>
                           <!-- <q-badge v-if="reg.requisites > 0" color="secondary" floating>{{reg.requisites}}</q-badge> -->
                           <q-menu fit>
                              <q-list>
                                 <q-item clickable  @click="openBrands(customer.id)" v-ripple >
                                    <q-item-section avatar>
                                       <q-icon name="copyright" />
                                    </q-item-section>
                                    <q-item-section>
                                       Marcas
                                    </q-item-section>
                                 </q-item>
                                 <q-item clickable  @click="openContacts(customer.id)" v-ripple >
                                    <q-item-section avatar>
                                       <q-icon name="person" />
                                    </q-item-section>
                                    <q-item-section>
                                       Contactos
                                    </q-item-section>
                                 </q-item>
                                 <q-item clickable v-if="customer.folder" @click="openFolder(customer.folder)" v-ripple >
                                    <q-item-section avatar>
                                       <q-icon name="folder" color="green" />
                                    </q-item-section>
                                    <q-item-section>
                                       Carpeta
                                    </q-item-section>
                                 </q-item>
                                 <q-item clickable v-else @click="editFolder(index)" v-ripple >
                                    <q-item-section avatar>
                                       <q-icon name="folder" />
                                    </q-item-section>
                                    <q-item-section>
                                       Agregar Carpeta
                                    </q-item-section>
                                 </q-item>
                                 <q-item clickable  @click="edit(index)" v-ripple class="text-orange">
                                    <q-item-section avatar>
                                       <q-icon name="edit" />
                                    </q-item-section>
                                    <q-item-section>
                                       Editar
                                    </q-item-section>
                                 </q-item>
                                 <q-item clickable @click="changeStatus(index)" v-if="customer.status == 1" v-ripple class="text-red">
                                    <q-item-section avatar>
                                       <q-icon name="block" />
                                    </q-item-section>
                                    <q-item-section>
                                       Inactivar
                                    </q-item-section>
                                 </q-item>
                                 <q-item clickable @click="changeStatus(index)" v-else v-ripple class="text-green">
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
				<infinite-loading class="text-center q-pt-md" spinner="spiral" @infinite="infiniteScroll" ref="infiniteLoading">
					<div slot="no-more">Ya no hay más registros</div>
					<div slot="no-results">Se llegó al final de los resultados</div>
				</infinite-loading>
         </q-card-section>
         <q-card-section>
            <q-dialog v-model="strategy_dialog">
               <q-card style="width:400px;">
                  <q-form @submit.prevent="saveStrategy">
                     <q-card-section>
                        <div class="row">
                           <div class="text-h6">Agregar Estrategia</div>
                           <q-space />
                           <q-btn icon="close" v-close-popup flat round />
                        </div>
                     </q-card-section>
                     <q-card-section>
                        <div class="row">
                           <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 q-pa-xs">
                              <q-input v-model="strategy" label="Estrategia *" outlined></q-input>
                              <div class="text-subtitle2 text-red" v-for="error in errors.strategy" :key="error">
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
            <q-dialog v-model="customer_dialog">
               <q-card style="width:800px; max-width: 90vw;">
                  <q-form @submit.prevent="Save">
                     <q-card-section>
                        <div class="row">
                           <div class="text-h6">{{dialogTitle}}</div>
                           <q-space />
                           <q-btn icon="close" v-close-popup flat round />
                        </div>
                     </q-card-section>
                     <q-card-section>
                        <div class="row">
                           <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 q-pa-xs">
                              <q-input v-model="customer" label="Nombre Comercial *" outlined></q-input>
                              <div class="text-subtitle2 text-red" v-for="error in errors.customer" :key="error">
                                 {{error}}
                              </div>
                           </div>
                        </div>
								<div class="row">
									<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 q-pa-xs">
										<q-select outlined v-model="strategy_id" :options="strategies" label="Seleccionar Estrategia *" emit-value option-value="id" map-options option-label="strategy" @input="changeStrategy" />
										<div class="text-subtitle2 text-red" v-for="error in errors.strategy_id" :key="error">
											{{error}}
										</div>
									</div>
									<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 q-pa-xs" v-if="strategy_id == 2">
										<q-select
											outlined
											v-model="referred_by"
											use-input
											behavior="menu"
											label="Referido por cliente..."
											input-debounce="0"
											:options="referrals"
											clearable
											emit-value option-value="id" map-options option-label="customer"
											@filter="customerSelect"
											>
											<template v-slot:no-option>
												<q-item>
													<q-item-section class="text-grey">
													No se encontraron resultados
													</q-item-section>
												</q-item>
											</template>
										</q-select>
										<div class="text-subtitle2 text-red" v-for="error in errors.referred" :key="error">
											{{error}}
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 q-pa-xs">
                              <q-input v-model="random_name" label="Referido por..." outlined></q-input>
                              <div class="text-subtitle2 text-red" v-for="error in errors.random_name" :key="error">
                                 {{error}}
                              </div>
                           </div>
									<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 q-pa-xs">
										<q-select outlined v-model="prospected_by" :options="prospecters" label="Prospectado por.." emit-value option-value="id" map-options option-label="user" />
										<div class="text-subtitle2 text-red" v-for="error in errors.prospected_by" :key="error">
											{{error}}
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 q-pa-xs">
                              <q-input v-model="folder" label="Carpeta de Google drive" outlined></q-input>
                              <div class="text-subtitle2 text-red" v-for="error in errors.folder" :key="error">
                                 {{error}}
                              </div>
                           </div>
								</div>
								<div class="row">
									<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 q-pa-xs">
                              <q-input v-model="comments" label="Comentarios" outlined type="textarea"></q-input>
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
            <Contacts :customer="customer_id" ref="contacts_form"></Contacts>
		      <Brands :customer="customer_id" ref="brands_form"></Brands>
         </q-card-section>
      </q-card>
   </q-page>
</template>

<script>
import Contacts from 'components/Contacts'
import Brands from 'components/Brands'
import InfiniteLoading from 'vue-infinite-loading'
export default {
   meta () {
      return {
         title: 'Emporio - Bitacoras'
      }
   },

   components:{Contacts, Brands, InfiniteLoading},
	data(){
		return{
			//Strategies
			strategy_dialog: false,
			strategy: '',
			search_customers:'',
			//Customers
			customers_count:0,
			customers:[],
			page:1,
			loading_table:false,
			customer_selected: '',
			customer_dialog: false,
			dialogTitle: '',
			customer_id: '',
			customer: '',
			strategy_id: '',
			referred_by: '',
			random_name:'',
			prospecters:[],
			prospected_by:'',
			referred_loading: false,
			folder: '',
			// web_page: '',
			//Referrals
			referrals: [],
			referred: null,
			search: null,
			referralLoading: false,
			//Stop referrals
			comments: '',
			strategies: [],
			customer_status: '',
			status_dialog: false,
			loading: false,
			errors: {},
		}
	},

	computed: {
		url(){
			return `${process.env.API}/customers?page=${this.page}`
		}
	},

	created(){
		this.customersCount()
		this.Load()
		
	},

	methods:{
		async customersCount(){
			await this.$axios.post(`${process.env.API}/customers-count`, {search:this.search_customers})
			.then(res => {
				this.customers_count = res.data
			})
		},

		async Load(){
         this.$q.loading.show()
			this.loading_table = true
			await this.$axios.post(this.url, {search:this.search_customers})
			.then(res => {
				this.customers = res.data.data
				this.customersCount()
            this.$q.loading.hide()
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
				this.$axios.post(this.url, {search:this.search_customers})
				.then( res => {

					let customers = res.data.data

					if(customers.length > 0){
						this.customers = this.customers.concat(customers)
						$state.loaded()
					}
					else{
						$state.complete()
					}
				})
				.catch(error => {

				})
			}, 100)
		},

		clearSearch(){
			this.search_customers = ''
			this.customers = {}
			this.page = 1
			this.$refs.infiniteLoading.stateChanger.reset()
			this.Load()
		},

		Reload(){
			this.customers = {}
			this.page = 1
			this.$refs.infiniteLoading.stateChanger.reset()
			this.Load()
		},

		customerSelect(val, update, abort){
         update(() => {
            this.$axios.post(`${process.env.API}/customers/list`, {search:val})
            .then(res => {
               this.referrals = res.data
            })
            .catch(error =>{
               this.referrals = []
            })
         })
      },

		changeStrategy(){
			if(this.strategy_id !== 1){
				this.referred_by = ''
				this.referrals = []
			}
		},

		createStrategy(){
			this.strategy_dialog = true
			this.strategy = ''
			this.errors = {}
			
		},

		async saveStrategy(){
			await this.$axios.post(`${process.env.API}/strategy`, {strategy:this.strategy})
				.then(res => {
					this.loading = false
					this.strategy = ''
					this.strategy_dialog = false
					this.$q.notify({
						message:'Se agregó el registro "' + res.data.strategy + '"',
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
						message:'No se pudo agregar el resgitro, revise los errores en el formulario',
						color:'negative',
						actions: [
							{ label: 'Cerrar', color: 'white', handler: () => {  } }
						]
					})
				})
		},

		async getStrategies(){
			await this.$axios.get(`${process.env.API}/getStrategies`)
			.then(res => {
				this.strategies = res.data
			})
			.catch(error =>{
				console.log(error)
			})
		},

		clearCustomer(){
			this.customer_selected = ''
			this.customer_id = ''
			this.customer = ''
			this.strategy_id = ''
			this.referred_by = ''
			this.referrals = ''
			this.random_name = ''
			this.prospected_by = ''
			this.prospecters = {}
			this.folder = ''
			// this.web_page = ''
			this.comments = ''
		},

		create(){
			this.getStrategies()
			this.getProspecters()
			this.dialogTitle = 'Agregar Cliente',
			this.customer_dialog = true
			this.clearCustomer()
			this.errors = {}
			
		},

		async getProspecters(){
			await this.$axios.get(`${process.env.API}/responsables`)
			.then(res => {
				this.prospecters = res.data
			})
		},

		edit(index){
			this.getStrategies()
			this.getProspecters()
			this.customer_dialog = true
			const customer = this.customers[index]
			this.customer_selected = index
			this.dialogTitle = 'Editar cliente: '+customer.customer
			this.customer_id = customer.id
			this.customer = customer.customer
			this.strategy_id = customer.strategy_id
			this.referred_by = customer.referred_by
			this.random_name = customer.random_name
			this.prospected_by = customer.prospected_by
			this.folder = customer.folder
			// this.web_page = customer.web_page
			this.comments = customer.comments
			// this.customers.splice(index, 1, customer.id)
			this.errors = {}
			

			if(customer.referred_by){
				this.customerSelect(customer.referred)
				this.referrals = customer.referred
			}
		},

		async Save(){
			this.loading = true
			//Update
			if(this.customer_id){
				await this.$axios.put(`${process.env.API}/customer/${this.customer_id}`, {customer:this.customer, strategy_id:this.strategy_id, referred_by:this.referred_by, random_name:this.random_name, prospected_by:this.prospected_by, folder:this.folder, comments:this.comments})
				.then(res => {
					this.customers.splice(this.customer_selected, 1, res.data)
					this.customer_dialog = false
					this.$q.notify({
						message: 'Se guardó el registro',
						color:'positive',
						actions: [
							{ label: 'Cerrar', color: 'white', handler: () => {  } }
						]
					})
					this.loading = false
					this.clearCustomer()
				})
				.catch(error => {
					this.loading = false
					this.errors = error.response.data.errors
					this.$q.notify({
						message: 'No se pudo guardar el registro, revise los errores en el formulario',
						color:'negative',
						actions: [
							{ label: 'Cerrar', color: 'white', handler: () => {  } }
						]
					})
				})
			}
			//Store
			else{
				await this.$axios.post(`${process.env.API}/customer`, {customer:this.customer, strategy_id:this.strategy_id, referred_by:this.referred_by, random_name:this.random_name, prospected_by:this.prospected_by, folder:this.folder, comments:this.comments})
				.then(res => {
					this.customers.unshift(res.data)
					this.loading = false
					this.clearCustomer()
					this.customer_dialog = false
					this.$q.notify({
						message: 'Se agregó el cliente '+res.data.customer,
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
						message: 'No se pudo guardar el registro, revise los errores en el formulario',
						color:'negative',
						actions: [
							{ label: 'Cerrar', color: 'white', handler: () => {  } }
						]
					})
				})
			}
		},

		async changeStatus(index){
			this.loading = true
			const customer = this.customers[index]
			await this.$axios.put(`${process.env.API}/customer/status/${customer.id}`, {status:customer.status})
			.then(res => {
				this.customers.splice(index, 1, res.data)
				this.loading = false
				this.clearCustomer()
				this.$q.notify({
					message: 'Se actualizó el estatus del cliente '+res.data.customer,
					color:'positive',
					actions: [
						{ label: 'Cerrar', color: 'white', handler: () => {  } }
					]
				})
			})
			.catch(error => {
				console.log(error)
				this.loading = false
				this.customer_id = ''
				this.customer_status = ''
				this.status_dialog = false
				this.$q.notify({
					message: 'No se pudo actualizar el estatus, inténtelo más tarde',
					color:'negative',
					actions: [
						{ label: 'Cerrar', color: 'white', handler: () => {  } }
					]
				})
			})
		},

		openFolder(folder){
			window.open(folder, '_blank')    
		},

		editFolder(index){
			alert('No hay url de carpeta, agréguela en el formulario de edición.')
			this.edit(index)
		},

		openContacts(customer_id){
			this.customer_id = customer_id
			this.$refs.contacts_form.openContacts(customer_id)
		},

		openBrands(customer_id){
			this.customer_id = customer_id
			this.$refs.brands_form.openBrands(customer_id)
		},

		formatNumeric(value) {
			let val = (value/1).toFixed(0)
			return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		},
	}
}
</script>