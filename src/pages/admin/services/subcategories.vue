<template>
   <q-page padding>
      <div class="row">
         <div class="text-h5">Subcategorías</div>
         <q-space/>
         <q-breadcrumbs class="align-right">
            <q-breadcrumbs-el label="Dashboard" icon="dashboard" to="/admin" />
            <q-breadcrumbs-el label="Subcategorías" icon="device_hub" />
         </q-breadcrumbs>
      </div>
      <q-card class="q-mt-md">
         <q-card-section>
            <q-btn label="subcategoría" icon-right="add" color="primary" @click="newSubcategory" />
         </q-card-section>
         <q-card-section>
            <q-markup-table wrap-cells>
               <thead>
                  <tr>
                     <th class="text-left" style="width:17%">Subcategoría</th>
                     <th class="text-left" style="width:15%">Bitácora</th>
                     <th class="text-left" style="width:10%">Renovación</th>
                     <th class="text-left" style="width:10%">Declaración</th>
                     <th class="text-left" style="width:10%">Recordatorio</th>
                     <th class="text-left" style="width:10%">Vencimiento</th>
                     <th class="text-center" style="width:10%">Registros</th>
                     <th class="text-center" style="width:10%">Estatus</th>
                     <th class="text-right" style="width:8%"></th>
                  </tr>
               </thead>
               <tbody>
                  <tr v-for="(reg, index) in subcategories" :key="index">
                     <td>{{ reg.subcategory }}</td>
                     <td>{{ reg.binnacle_status }}</td>
                     <td class="text-center">
                        <q-chip v-if="reg.renovation" color="positive" dark>Si</q-chip>
                        <q-chip v-else color="negative" dark>No</q-chip>
                     </td>
                     <td>
                        <span v-if="reg.declaration_use == 0" class="text-grey">N/A</span>
                        <span v-if="reg.declaration_use > 0 && reg.declaration_use <= 30">{{ Math.round(reg.declaration_use) }} día/s</span>
                        <span v-if="reg.declaration_use > 30 && reg.declaration_use <= 365">{{ Math.round(reg.declaration_use / 30.4) }} mes/es</span>
                        <span v-if="reg.declaration_use > 365">{{ Math.round(reg.declaration_use / 365.25) }} año/s</span>
                     </td>
                     <td>
                        <span v-if="reg.reminder == 0" class="text-grey">N/A</span>
                        <span v-if="reg.reminder > 0 && reg.reminder <= 30">{{ Math.round(reg.reminder) }} día/s</span>
                        <span v-if="reg.reminder > 30 && reg.reminder <= 365">{{ Math.round(reg.reminder / 30.4) }} mes/es</span>
                        <span v-if="reg.reminder > 365">{{ Math.round(reg.reminder / 365.25) }} año/s</span>
                     </td>
                     <td>
                        <span v-if="reg.expiration == 0" class="text-grey">N/A</span>
                        <span v-if="reg.expiration > 0 && reg.expiration <= 30">{{ Math.round(reg.expiration) }} día/s</span>
                        <span v-if="reg.expiration > 30 && reg.expiration <= 365">{{ Math.round(reg.expiration / 30.4) }} mes/es</span>
                        <span v-if="reg.expiration > 365">{{ Math.round(reg.expiration / 365.25) }} año/s</span>
                     </td>
                     <td class="text-center">{{ reg.registries }}</td>
                     <td class="text-center">
                        <q-chip v-if="reg.status == 1" color="positive" dark>Activo</q-chip>
                        <q-chip v-else color="negative" dark>Inactivo</q-chip>
                     </td>
                     <td class="text-right">
                        <q-btn color="grey" icon="menu" size="sm">
                           <q-menu>
                              <q-list>
                                 <q-item clickable @click="edit(index)" v-ripple class="text-orange">
                                    <q-item-section avatar>
                                       <q-icon name="edit" />
                                    </q-item-section>
                                    <q-item-section>
                                       Editar
                                    </q-item-section>
                                 </q-item>
                                 <q-item v-if="reg.status == 1" clickable v-ripple class="text-red">
                                    <q-item-section avatar>
                                       <q-icon name="block" />
                                    </q-item-section>
                                    <q-item-section>
                                       Inactivar
                                    </q-item-section>
                                 </q-item>
                                 <q-item v-else clickable v-ripple class="text-green">
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
         </q-card-section>
         <q-card-section>
            <q-dialog v-model="subcat_dialog" transition-show="slide-up" transition-hide="slide-down">
               <q-card style="width:1200px">
                  <q-card-section>
                     <div class="row">
                        <div class="text-h6">Subcategoría</div>
                        <q-space />
                        <q-btn dense flat icon="close" v-close-popup> 
                           <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
                        </q-btn>
                     </div>
                  </q-card-section>
                  <q-card-section>
                     <div class="row">
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 q-pa-xs">
                           <q-input v-model="subcategory" label="Subcategoría" outlined></q-input>
                           <div class="text-subtitle2 text-red" v-for="error in errors.subcategory" :key="error">
                              {{error}}
                           </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 q-pa-xs">
                           <q-select v-model="status_category_id" outlined emit-value option-value="id" map-options option-label="category" :options="statuses" label="Seleccionar Estatus" />
                           <div class="text-subtitle2 text-red" v-for="error in errors.status_category_id" :key="error">
                              {{error}}
                           </div>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 q-pa-xs">
                           <q-select v-model="declaration_use_select" outlined emit-value option-value="value" map-options option-label="period" :options="periods" label="Declaración de uso" />
                        </div>
                        <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 col-xl-4 q-pa-xs">
                           <q-input v-model="declaration_use" label="Declaración de uso" outlined type="number" step="any" min="0"></q-input>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 q-pa-xs">
                           <q-select v-model="reminder_select" outlined emit-value option-value="value" map-options option-label="period" :options="periods" label="Recordatorio" />
                        </div>
                        <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 col-xl-4 q-pa-xs">
                           <q-input v-model="reminder" label="Recordatorio" outlined type="number" step="any" min="0"></q-input>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 q-pa-xs">
                           <q-select v-model="expiration_select" outlined emit-value option-value="value" map-options option-label="period" :options="periods" label="Vencimiento" />
                        </div>
                        <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 col-xl-4 q-pa-xs">
                           <q-input v-model="expiration" label="Vencimiento" outlined type="number" step="any" min="0"></q-input>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 q-pa-xs">
                           <q-checkbox v-model="renovation" :true-value="1" :false-value="0" label="Renovación" />
                        </div>
                     </div>
                  </q-card-section>
                  <q-card-section class="row"> 
                     <q-space />
                     <q-btn label="Cerrar" class="q-mx-xs" flat v-close-popup />
                     <q-btn label="Guardar" class="q-mx-xs" color="primary" :loading="loading" @click="Save" />
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
         title: 'Emporio - Subcategorías'
      }
   },

   data(){
      return{
         subcat_dialog:false,
			//Data
			subcategory_id:'',
			selected_subcategory:'',
			subcategory:'',
			statuses:[],
			status_category_id:'',
			declaration_use_select:'',
			declaration_use:0,
			expiration_select:'',
			expiration:0,
			reminder_select:'',
			reminder:0,
			renovation:1,
			periods:[
				{value:1, period:'Días'},
				{value:2, period:'Meses'},
				{value:3, period:'Años'}
			],
			//View
			loading:false,
         subcategories:[],
			loading_table:false,
			errors:[],
      }
   },

   created(){
      this.loadSubcategories();
   },

   methods:{
      async loadSubcategories(){
         this.loading_table = true;
         await this.$axios.get(`${process.env.API}/subcategories`)
         .then(res => {
               this.subcategories = res.data;
               this.loading_table = false;
         })
         .catch(error => {
               this.loading_table = false;
               console.log(error)
         })
      },

      newSubcategory(){
			this.subcat_dialog = true;
			this.getCategories();
			this.clearData();
		},

		getCategories(){
         this.$axios.get(`${process.env.API}/get-categories`)
			.then(res => {
				this.statuses = res.data;
			})
		},

		clearData(){
			this.subcategory_id = '';
			this.subcategory = '';
			this.selected_subcategory = '';
			this.status_category_id = '';
			this.declaration_use_select = '';
			this.declaration_use = 0;
			this.reminder_select = '';
			this.reminder = 0;
			this.expiration_select = '';
			this.expiration = 0;
			this.renovation = 1;
		},

		async edit(index){
			this.subcat_dialog = true;
			this.getCategories();
			this.selected_subcategory = index;
         let id = this.subcategories[index].id;
         await this.$axios.get(`${process.env.API}/subcategory/edit/${id}`)
			.then(res => {
				this.subcategory_id = res.data.id;
				this.subcategory = res.data.subcategory;
				this.renovation = res.data.renovation * 1;
				if(res.data.expiration > 0){
					if(res.data.expiration <= 30){
						this.expiration_select = 1;
						this.expiration = Math.round(res.data.expiration);
					}
					else if(res.data.expiration > 30 && res.data.expiration <= 365){
						this.expiration = Math.round(res.data.expiration / 30.4);
						this.expiration_select = 2;
					}
					else if(res.data.expiration > 365){
						this.expiration = Math.round(res.data.expiration / 365.25);
						this.expiration_select = 3;
					}
				}
				else{
					this.expiration_select = '';
					this.expiration = 0;
				}

				if(res.data.reminder > 0){
					if(res.data.reminder <= 30){
						this.reminder = Math.round(res.data.reminder);
						this.reminder_select = 1;
					}
					else if(res.data.reminder > 30 && res.data.reminder <= 365){
						this.reminder = Math.round(res.data.reminder / 30.4);
						this.reminder_select = 2;
					}
					else if(res.data.reminder > 365){
						this.reminder = Math.round(res.data.reminder / 365.25);
						this.reminder_select = 3;
					}
				}
				else{
					this.reminder_select = '';
					this.reminder = 0;
				}

				if(res.data.declaration_use > 0){
					if(res.data.declaration_use <= 30){
						this.declaration_use = Math.round(res.data.declaration_use);
						this.declaration_use_select = 1;
					}
					else if(res.data.declaration_use > 30 && res.data.declaration_use <= 365){
						this.declaration_use = Math.round(res.data.declaration_use / 30.4);
						this.declaration_use_select = 2;
					}
					else if(res.data.declaration_use > 365){
						this.declaration_use = Math.round(res.data.declaration_use / 365.25);
						this.declaration_use_select = 3;
					}
				}
				else{
					this.declaration_use_select = '';
					this.declaration_use = 0;
				}

				this.status_category_id = res.data.status_category_id * 1;
			})
		},

		async Save(){
			this.loading = true;
			let expiration = 0;
			let reminder = 0;
			let declaration_use = 0;

			if(this.expiration > 0){
				if(this.expiration_select == 1){
					expiration = this.expiration;
				}
				else if(this.expiration_select == 2){
					expiration = Math.round(this.expiration * 30.4);
				}
				else if(this.expiration_select == 3){
					expiration = Math.round(this.expiration * 365.25);
				}
			}
			else{
				expiration = 0;
			}

			if(this.reminder > 0){
				if(this.reminder_select == 1){
					reminder = this.reminder;
				}
				else if(this.reminder_select == 2){
					reminder = Math.round(this.reminder * 30.4);
				}
				else if(this.reminder_select == 3){
					reminder = Math.round(this.reminder * 365.25);
				}
			}
			else{
				reminder = 0;
			}

			if(this.declaration_use > 0){
				if(this.declaration_use_select == 1){
					declaration_use = this.declaration_use;
				}
				else if(this.declaration_use_select == 2){
					declaration_use = Math.round(this.declaration_use * 30.4);
				}
				else if(this.declaration_use_select == 3){
					declaration_use = Math.round(this.declaration_use * 365.25);
				}
			}
			else{
				declaration_use = 0;
			}

			if(this.subcategory_id){
            await this.$axios.put(`${process.env.API}/subcategory/update/${this.subcategory_id}`,{subcategory:this.subcategory, status_category_id:this.status_category_id, declaration_use:declaration_use, renovation:this.renovation, reminder:reminder, expiration:expiration})
				.then(res => {
					this.subcategories[this.selected_subcategory] = res.data;
					this.$q.notify({
                  message:'Se actualizó el registro',
                  color:'positive',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
					this.loading = false;
					this.subcat_dialog = false;
				})
				.catch(error => {
					this.errors = error.response.data.errors;
					this.$q.notify({
                  message:'No se pudo actualizar el registro',
                  color:'negative',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
					this.loading = false;
				})
			}
			else{
            await this.$axios.post(`${process.env.API}/subcategory/store/${this.subcategory_id}`,{subcategory:this.subcategory, status_category_id:this.status_category_id, declaration_use:declaration_use, renovation:this.renovation, reminder:reminder, expiration:expiration})
				.then(res => {
					this.subcategories.unshift(res.data);
					this.snackbar = true;
					this.snackColor = 'success';
					this.snackText = 'Se guardó el registro exitosamente.';
					this.timeout = 3500;
					this.loading = false;
					this.subcat_dialog = false;
				})
				.catch(error => {
					this.errors = error.response.data.errors;
					this.snackbar = true;
					this.snackColor = 'error';
					this.snackText = 'No se pudo guardar el registro, revise los errores en el formulario.';
					this.timeout = 3500;
					this.loading = false;
				})
			}
		}
   } 
   
}
</script>