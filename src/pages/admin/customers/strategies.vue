<template>
   <q-page padding>
      <div class="row">
         <div class="text-h5">Estrategias</div>
         <q-space/>
         <q-breadcrumbs class="align-right">
            <q-breadcrumbs-el label="Dashboard" icon="dashboard" to="/admin" />
            <q-breadcrumbs-el label="Estrategias" icon="thumb_up" />
         </q-breadcrumbs>
      </div>
      <q-card class="q-mt-md">
         <q-card-section>
            <div class="row">
               <q-btn label="Agregar Estrategia" icon-right="add" color="secondary" @click="create" />
               <q-space />
               <q-btn round push color="grey" icon="sync" @click="Load"/>
            </div>
         </q-card-section>
         <q-card-section>
            <q-markup-table wrap-cells>
               <thead>
                  <tr>
                     <th class="text-left">Estrategia</th>
                     <th class="text-left">Clientes</th>
                     <th class="text-left">Creada</th>
                     <th class="text-left">Estatus</th>
                     <th class="text-right"></th>
                  </tr>
               </thead>
               <tbody>
                  <tr v-for="(strategy, index) in strategies" :key="index">
                     <td>{{ strategy.strategy }}</td>
                     <td>{{ strategy.customers }}</td>
                     <td>{{ strategy.created_at }}</td>
                     <td>
                        <q-chip v-if="strategy.status == 1" color="positive" dark>Activo</q-chip>
                        <q-chip v-else color="negative" dark>Inactivo</q-chip>
                     </td>
                     <td class="text-right">
                        <q-btn round class="q-ma-xs" color="orange" icon="edit" size="sm" @click="edit(index, strategy.id, strategy.strategy)" />
                        <q-btn round class="q-ma-xs" color="negative" v-if="strategy.status == 1" icon="block" size="sm" @click="changeStatus(index)" />
                        <q-btn round class="q-ma-xs" color="positive" v-else icon="check" size="sm" @click="changeStatus(index)" />
                     </td>
                  </tr>
               </tbody>
            </q-markup-table>
         </q-card-section>
         <q-card-section>
            <q-dialog v-model="strategy_dialog">
               <q-card style="width:400px;">
                  <q-bar class="bg-primary text-white">
                     <div class="text-h6">Estrategia</div>
                     <q-space />
                     <q-btn dense flat icon="close" v-close-popup>
                        <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
                     </q-btn>
                  </q-bar>
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
                        <q-btn label="Guardar" icon-right="save" color="secondary" :loading="loading"  @click="Save" class="q-ma-xs" />
                     </div>
                  </q-card-section>
               </q-card>
            </q-dialog>
         </q-card-section>
      </q-card>
   </q-page>
</template>

<script>
export default {
   meta () {
      return {
         title: 'Emporio - Bitacoras'
      }
   },

   data(){
		return{
			strategies:{},
			strategy_dialog: false,
			status_dialog: false,
			strategy_id: '',
			strategy_index: '',
			strategy: '',
			strategy_status: '',
			loading: false,
			errors: {},
			loading_table:false,

		}
	},

	created(){
		this.Load()
	},

	methods:{
		async Load(){
			this.loading_table = true
			await this.$axios.get(`${process.env.API}/strategies`)
			.then(res => {
				this.strategies = res.data
				this.loading_table = false
			})
			.catch(error =>{
				console.log(error)
				this.loading_table = false
			})
		},

		create(){
			this.strategy_dialog = true
			this.strategy_id = ''
			this.strategy_index = ''
			this.strategy = ''
			this.errors = {}
			
		},

		edit(index, id, strategy){
         this.strategy_index = index
			this.strategy_dialog = true
			this.strategy_id = id
			this.strategy = strategy
			this.errors = {}
		},

		async Save(){
			this.loading = true
			//Update
			if(this.strategy_id){
				await this.$axios.put(`${process.env.API}/strategy/${this.strategy_id}`, {strategy:this.strategy})
				.then(res => {
               this.strategies.splice(this.strategy_index, 1, res.data)
					this.loading = false
					this.strategy_id = ''
					this.strategy = ''
					this.strategy_index = ''
					this.strategy_dialog = false
					this.$q.notify({
                  message:'Se actualizó la estrategia',
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
                  message:'No se pudo guardar el registro, revise los errores en el formulario',
                  color:'negative',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
				})
			}
			//Store
			else{
				await this.$axios.post(`${process.env.API}/strategy`, {strategy:this.strategy})
				.then(res => {
					this.strategies.unshift(res.data)
					this.loading = false
					this.strategy_id = ''
					this.strategy = ''
               this.strategy_dialog = false
               this.$q.notify({
                  message:'Se guardó la estrategia',
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
                  message:'No se pudo guardar el registro, revise los errores en el formulario',
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
         const reg = this.strategies[index]
			await this.$axios.put(`${process.env.API}/strategy/status/${reg.id}`, {status:reg.status})
			.then(res => {
            this.loading = false
            this.strategies.splice(index, 1, res.data)
            this.$q.notify({
               message:'Se actualizó la estrategia',
               color:'positive',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
			})
			.catch(error => {
            this.loading = false
            this.$q.notify({
               message:'No se pudo actualizar el registro, inténtelo más tarde',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
			})
		}
	}
   
}
</script>