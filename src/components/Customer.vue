<template>
   <div>
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
                        <q-input v-model="customer" label="Nombre Comercial *" class="text-uppercase" outlined></q-input>
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
   </div>
</template>

<script>
export default {
   data(){
      return{
         //Customers
         loading:false,
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
         errors:{},
         //Referrals
			referrals: [],
			referred: null,
			search: null,
			referralLoading: false,
			//Stop referrals
			comments: '',
			strategies: [],
      }
   },

   methods:{
      createCustomer(){
         this.getStrategies()
			this.getProspecters()
			this.dialogTitle = 'Agregar Cliente',
			this.customer_dialog = true
			this.clearCustomer()
			this.errors = {}
      },

      editCustomer(customer){
         this.getStrategies()
			this.getProspecters()
			this.customer_dialog = true
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

      async getStrategies(){
			await this.$axios.get(`${process.env.API}/getStrategies`)
			.then(res => {
				this.strategies = res.data
			})
			.catch(error =>{
				console.log(error)
			})
		},

      async getProspecters(){
			await this.$axios.get(`${process.env.API}/responsables`)
			.then(res => {
				this.prospecters = res.data
			})
      },

      changeStrategy(){
			if(this.strategy_id !== 1){
				this.referred_by = ''
				this.referrals = []
			}
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
      

      async Save(){
			this.loading = true
			//Update
			if(this.customer_id){
				await this.$axios.put(`${process.env.API}/customer/${this.customer_id}`, {customer:this.customer, strategy_id:this.strategy_id, referred_by:this.referred_by, random_name:this.random_name, prospected_by:this.prospected_by, folder:this.folder, comments:this.comments})
				.then(res => {
					this.$emit('updateCustomer', res.data);
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
               this.$emit('storeCustomer', res.data);
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
   }
}
</script>