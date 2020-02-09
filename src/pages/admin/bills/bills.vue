<template>
   <q-page padding>
      <div class="row">
         <div class="text-h5">Facturas</div>
         <q-space/>
         <q-breadcrumbs class="align-right">
            <q-breadcrumbs-el label="Dashboard" icon="dashboard" to="/admin" />
            <q-breadcrumbs-el label="Facturas" icon="description" />
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
               <q-btn round push color="grey" icon="sync" @click="Reload"/>
            </div>
         </q-card-section>
         <q-card-section>
            <div class="row">
               <div class="col-xs-12 col-sm-12 col-md-6 col-lg-5 col-xl-5 q-pa-xs">
                  <q-input v-model="search_table" label="Buscar factura, recibo o cliente..." outlined v-on:keyup.enter="Reload" v-on:keyup.esc="clearSearch">
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
            <q-btn color="primary" flat @click="sortBy">
               <div class="row items-center no-wrap">
                  <q-icon v-if="orderBy == 'asc'" left small name="keyboard_arrow_up" />
                  <q-icon v-if="orderBy == 'desc'" left small name="keyboard_arrow_down" />
                  <div class="text-center">Ordenar por folio</div>
               </div>
            </q-btn>
         </q-card-section>
         <q-card-section>
            <q-markup-table wrap-cells>
               <thead>
                  <tr>
                     <th class="text-left" style="width:10%">Folio</th>
                     <th class="text-left" style="width:14%">Fecha</th>
                     <th class="text-left" style="width:30%">Cliente</th>
                     <th class="text-center" style="width:12%">Total</th>
                     <th class="text-center" style="width:12%">Saldo</th>
                     <th class="text-center" style="width:8%">Usuario</th>
                     <th class="text-center" style="width:8%">Estatus</th>
                     <th class="text-right" style="width:6%"></th>
                  </tr>
               </thead>
               <tbody>
                  <tr v-for="(bill, index) in bills" :key="index">
                     <td :title="bill.id">
                        <q-chip v-if="bill.status == 0" square dark color="orange" :label="bill.folio"/>
                        <q-chip v-if="bill.status == 1" square dark color="positive" :label="bill.folio"/>
                        <q-chip v-if="bill.status == 2" square dark color="negative" :label="bill.folio"/>
                        <q-chip v-if="bill.status == 3" square dark color="negative" :label="bill.folio"/>
                     </td>
                     <td>{{ bill.date }}</td>
                     <td>{{ bill.customer }}</td>
                     <td class="text-right">{{ formatPrice(bill.total) }}</td>
                     <td class="text-right">{{ formatPrice(bill.balance) }}</td>
                     <td class="text-center">{{ bill.initials }}</td>
                     <td class="text-center">
                        <q-chip v-if="bill.status == 0" size="sm" square dark color="orange" label="Pendiente"/>
                        <q-chip v-if="bill.status == 1" size="sm" square dark color="positive" label="Pagado"/>
                        <q-chip v-if="bill.status == 2" size="sm" square dark color="negative" label="Cancelado"/>
                        <q-chip v-if="bill.status == 3" size="sm" square dark color="negative" label="Reemplazado"/>
                     </td>
                     <td>
                        <q-btn color="grey" icon="menu" flat size="md">
                           <q-menu auto-close>
                              <q-list>
                                 <q-item clickable @click="editBill(index)" v-ripple class="text-orange">
                                    <q-item-section avatar>
                                       <q-icon name="edit" />
                                    </q-item-section>
                                    <q-item-section>
                                       Editar
                                    </q-item-section>
                                 </q-item>
                                 <q-item clickable v-if="bill.status < 2" @click="Cancel(index)" v-ripple class="text-red">
                                    <q-item-section avatar>
                                       <q-icon name="block" />
                                    </q-item-section>
                                    <q-item-section>
                                       Cancelar
                                    </q-item-section>
                                 </q-item>
                                 <q-item clickable v-if="bill.status > 1" @click="Activate(index)" v-ripple class="text-gree">
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
                     <td style="width:100%" colspan="100%">
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
            <Service ref="services_form" v-on:addService="newService($event)" v-on:updateService="updateService($event)"></Service>
            <Customer ref="customers_form" v-on:storeCustomer="storeCustomer($event)"></Customer>
            <Bill ref="bills_form" v-on:updateServices="Reload()" v-on:newBill="newBill($event)" v-on:updateBill="updateBill($event)" v-on:reloadBills="reloadBills"></Bill>
         </q-card-section>
      </q-card>
   </q-page>
</template>

<script>
import Customer from 'components/Customer'
import Service from 'components/Service'
import Bill from 'components/Bill'
import InfiniteLoading from 'vue-infinite-loading'
export default {
   meta () {
      return {
         title: 'Emporio - Facturas'
      }
   },

   components:{Customer, Service, Bill, InfiniteLoading},

	data(){
		return{
			//Data
			bills:[],
			bills_loading:false,
			search_table:'',
			selected_bill:'',
			orderBy:'desc',
			page:1,
		}
	},

	computed: {
		url(){
			return `${process.env.API}/bills?page=${this.page}`
		}
	},

	created(){
		this.loadFilters();
		this.Load();
	},

	methods:{
		loadFilters(){
			this.search_table = '';
		},

		async Load(){
			this.bills_loading = true;
			await this.$axios.post(this.url, {search:this.search_table, orderBy:this.orderBy, type:'Factura'})
			.then(res => {
				this.bills = res.data.data;
				this.bills_loading = false;
			})
			.catch(error => {
				this.bills_loading = false; 
			})
		},

		infiniteScroll($state){
			setTimeout(() => {
				this.page++
				this.$axios.post(this.url, {search:this.search_table, orderBy:this.orderBy, type:'Factura'})
				.then( res => {

					let bills = res.data.data;

					if(bills.length > 0){
						this.bills = this.bills.concat(bills);
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
			this.loadFilters();
			this.bills = {};
			this.page = 1;
			this.$refs.infiniteLoading.stateChanger.reset();
			this.Load();
		},

		Reload(){
			this.bills = {};
			this.page = 1;
			this.$refs.infiniteLoading.stateChanger.reset();
			this.Load();
		},

		sortBy(){
			if(this.orderBy == 'desc'){
				this.orderBy = 'asc';
				this.Load();
			}
			else{
				this.orderBy = 'desc';
				this.Load();
			}
		},
      
      reloadBills(){
         this.Reload()
      },

		createCustomer(){
			this.$refs.customers_form.createCustomer()
      },
      
      storeCustomer(data){
         //Only for customers view
		},

		addService(){
			this.$refs.services_form.addService();
		},

		addPackage(){
			this.$refs.services_form.addPackage();
		},

		addBill(){
			this.$refs.bills_form.addBillAlready('', '', 'Factura', 2);
		},

		newBill(data){
			this.bills.unshift(data);
		},

		editBill(index){
			this.selected_bill = index;
			this.$refs.bills_form.editBill(this.bills[index].id,2);
		},

		updateBill(data){
			this.bills.splice(this.selected_bill, 1, data);
			this.selected_bill = '';
		},

		formatPrice(value) {
			let val = (value/1).toFixed(2).replace('.,', '.')
			return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		},

		async Cancel(index){
         await this.$axios.put(`${process.env.API}/bill/cancel/${this.bills[index].id}`)
			.then(res => {
				this.$q.notify({
               message:'Se canceló la factura',
               color:'positive',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
				this.errors = {};
				this.bills[index] = res.data;
			})
			.catch(error => {
				console.log(error);
				this.loading_cancel = false;
			})
		},
		
		async Activate(index){
			await this.$axios.put(`${process.env.API}/bill/activate/${this.bills[index].id}`)
			.then(res => {
				this.$q.notify({
               message:'Se activó la factura',
               color:'positive',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
				this.errors = {};
				this.bills[index] = res.data;
			})
			.catch(error => {
				console.log(error);
				this.loading_cancel = false;
			})
      }
   }
}
</script>

<style>
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