<template>
   <div>
      <q-dialog v-model="brands_dialog" maximized persistent transition-show="slide-up" transition-hide="slide-down">
         <q-card>
            <q-bar class="bg-primary text-white">
               <div class="text-h6">Marcas y Registros</div>
               <q-space />
               <q-btn dense flat icon="close" v-close-popup>
                  <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
               </q-btn>
            </q-bar>
            <q-card-section>
               <div class="row">
                  <q-btn label="Agregar Marca" icon-right="add" color="primary" @click="createBrand" class="q-ma-xs" />
                  <q-space />
                  <q-btn round push color="grey" icon="sync" @click="Reload"/>
               </div>
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 q-pa-xs">
                     <q-select
                        outlined
                        v-model="search_brand"
                        use-input
                        behavior="menu"
                        label="Agregar marcas existentes..."
                        input-debounce="0"
                        :options="search_items"
                        clearable
                        emit-value option-value="id" map-options option-label="brand"
                        @filter="brandSelect"
                        >
                        <template v-slot:no-option>
                           <q-item>
                              <q-item-section class="text-grey">
                              No se encontraron resultados
                              </q-item-section>
                           </q-item>
                        </template>
                        <template v-slot:after>
                           <q-btn round dense flat icon="add" color="primary" @click="addKnownBrand" :loading="searchLoading" />
                        </template>
                     </q-select>
                     <div class="text-subtitle2 text-red" v-for="error in errors.brand_id" :key="error">
                        {{error}}
                     </div>
                  </div>
               </div>
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 q-pa-xs">
                     <q-input v-model="search_brands" label="Búsqueda" outlined v-on:keyup.enter="Reload" v-on:keyup.esc="clearSearch">
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
                        <th class="text-left" style="width:5%;"></th>
                        <th class="text-left" style="width:21%;">Marca</th>
                        <th class="text-center" style="width:11%;">Registro</th>
                        <th class="text-center" style="width:11%;">Declaración</th>
                        <th class="text-center" style="width:11%;">Recordatorio</th>
                        <th class="text-center" style="width:11%;">Vencimiento</th>
                        <th class="text-center" style="width:10%;">Estatus</th>
                        <th class="text-center" style="width:10%;">Creado</th>
                        <th class="text-right" style="width:10%;"></th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr v-for="(brand, index) in brands" :key="index">
                        <td>
                           <q-avatar>
                              <img :src="brand.logo_url">
                           </q-avatar>
                        </td>
                        <td>{{ brand.brand }}</td>
                        <td class="text-center">{{ brand.registration_date }}</td>
                        <td class="text-center">{{ brand.date_declaration }}</td>
                        <td class="text-center">{{ brand.date_reminder }}</td>
                        <td class="text-center">{{ brand.date_expiration }}</td>
                        <td class="text-center">
                           <q-chip v-if="brand.status == 1" color="positive" dark label="Activo"/>
                           <q-chip v-else dark color="negative" label="Inactivo"/>
                        </td>
                        <td class="text-center">{{ brand.created_at }}</td>
                        <td class="text-right">
                           <q-btn round class="q-ma-xs" color="orange" icon="edit" size="sm" @click="edit(index)" />
                           <q-btn round class="q-ma-xs" color="negative" icon="block" size="sm" @click="deleteBrand(index)" />
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
               <q-dialog v-model="brand_dialog">
                  <q-card style="width:400px;">
                     <q-form @submit.prevent="Save">
                        <q-card-section>
                           <div class="row">
                              <div class="text-h6">{{ dialog_title }}</div>
                              <q-space />
                              <q-btn icon="close" v-close-popup flat round />
                           </div>
                        </q-card-section>
                        <q-card-section>
                           <div class="row">
                              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 q-pa-xs">
                                 <q-input v-model="brand" label="Marca o slogan *" outlined></q-input>
                                 <div class="text-subtitle2 text-red" v-for="error in errors.brand" :key="error">
                                    {{error}}
                                 </div>
                              </div>
                           </div>
                           <div class="row">
                              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 q-pa-xs">
                                 <q-input v-model="description" label="Descripción (opcional)" type="textarea" outlined></q-input>
                                 <div class="text-subtitle2 text-red" v-for="error in errors.description" :key="error">
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
         </q-card>
      </q-dialog>
   </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
export default {
   components:{InfiniteLoading},
   data(){
      return {
         //brands
         brands_dialog: false,
         brands: [],
         brands_loading: false,
         customer_id: '',
         search_brands:'',
         page:1,
         //Known brands
         search:false,
         search_brand:'',
         search_items:[],
         searchLoading:false,
         known_brand:'',
         //Contact form
         errors:[],
         brand_dialog: false,
         dialog_title:'',
         loading: false,
         brand_id: '',
         brand: '',
         description:'',
         selected_brand:'',
         //Logo
         logo_dialog:false,
         logo:'',
         selectedFile:'',
         selected_logo:''
      }
   },

	computed: {
		url(){
			return `${process.env.API}/customer/brands?page=${this.page}`
		}
	},

   methods:
   {
      //Contacts
      openBrands(customer_id)
      {
         this.page = 1
         this.brands_dialog = true
         this.search_brands = ''
         this.search_items = []
         this.customer_id = customer_id
         // this.$refs.infiniteLoading.stateChanger.reset()
         this.Load()
      },

      async Load()
      {
         this.brands_loading = true
         await this.$axios.post(this.url, {id:this.customer_id, search:this.search_brands})
         .then(res =>
         {
            this.brands = res.data.data
            this.brands_loading = false
         })
         .catch(error =>
         {
            console.log(error)
            this.brands_loading = false
         })
      },

      infiniteScroll($state){
         setTimeout(() => {
            this.page++
            this.$axios.post(this.url, {id:this.customer_id, search:this.search_brands})
            .then( res => {

               let brands = res.data.data

               if(brands.length > 0){
                  this.brands = this.brands.concat(brands)
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
         this.search_brands = ''
         this.brands = {}
         this.page = 1
         this.$refs.infiniteLoading.stateChanger.reset()
         this.Load()
      },

      Reload(){
         this.brands = {}
         this.page = 1
         this.$refs.infiniteLoading.stateChanger.reset()
         this.Load()
      },

      brandSelect(val, update, abort){
         update(() => {
            this.$axios.post(`${process.env.API}/customer/brand-list`, {customer_id:this.customer_id, search:val})
            .then(res => {
               this.search_items = res.data
            })
            .catch(error =>{
               console.log(error)
            })
         })
      },
      
      /* async brandSelect(val){
         this.searchLoading = true
         if(val){
            await this.$axios.post('/api/customer/brand-list', {customer_id:this.customer, search:val})
            .then(res => {
               this.search_items = res.data
               this.known_brand = this.search_brand.id
               this.searchLoading = false
            })
            .catch(error => {
               console.log(error)
               this.searchLoading = false
            })
         }
         else{
            this.search_items = {}
            this.seach_brand = ''
         }
      }, */

      async addKnownBrand(){
         this.searchLoading = true
         await this.$axios.post(`${process.env.API}/customer/add-brand`, {customer_id:this.customer_id, brand_id:this.search_brand})
         .then(res => {
            this.searchLoading = false
            this.brands.unshift(res.data)
            this.search_brand = ''
            this.search_items = {}
         })
         .catch(error => {
            this.searchLoading = false
            this.errors = error.response.data.errors
         })
      },

         clearBrandForm()
         {
         this.brand_id = ''
         this.brand = ''
         this.description =''
         this.errors = {}
         },

         createBrand()
         {
         if (this.customer_id == ''){
            this.brands_dialog = false
         }
         else{
            this.brand_dialog = true
            this.dialog_title = 'Crear marca'
            this.clearBrandForm()
         }
      },

      edit(index){
         this.brand_dialog = true
         const brand = this.brands[index]
         this.selected_brand = index
         this.dialog_title = 'Editar marca'
         this.brand_id = brand.id
         this.brand = brand.brand
         this.description = brand.description
         this.errors = {}
      },
      
      async Save(){
         this.loading = true
         //Update
         if(this.brand_id){
            await this.$axios.put(`${process.env.API}/customer/brand/${this.brand_id}`, {brand:this.brand, description:this.description})
            .then(res => {
               this.loading = false
               this.brands.splice(this.selected_brand, 1, res.data)
               this.brand_dialog = false
               this.clearBrandForm()
               this.$q.notify({
						message:'Se guardó el registro',
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
            await this.$axios.post(`${process.env.API}/customer/brand`, {brand:this.brand, description:this.description, customer_id:this.customer_id})
            .then(res => {
               this.loading = false
               this.brands.unshift(res.data)
               this.clearBrandForm()
               this.brand_dialog = false
               this.$q.notify({
						message:'Se guardó el registro',
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

      deleteBrand(index){
         const brand_to_delete = this.brands[index]
         this.$axios.post(`${process.env.API}/customer/brand-delete`, {customer_id:this.customer_id, brand_id:brand_to_delete.id})
         .then(res => {
            this.brands.splice(index, 1)
            this.$q.notify({
               message:'Se eliminó la marca del cliente',
               color:'positive',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
         .catch(error => {
            console.log(error)
            this.$q.notify({
               message:'No se pudo eliminar el registro, inténtelo más tarde',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
      },

      changeLogo(index){
         this.logo_dialog = true
         const logo = this.logo[index]
         this.selected_logo = index
         this.brand_id = logo.id
         this.logo = logo.logo_url
         this.errors = {}
      },

      pickFile(){
         this.$refs.fileSelected.click()
      },

      onFileSelected(event){
         const files = event.target.files
            this.selectedFile = event.target.files[0]
            let filename = files[0].name
            let size = files[0].size 

            if(!filename){
                  this.selectedFile = null
                  return
            }

            if(size > 2000000){
                  alert( 'Archivo demasiado pesado. El límite es de 2mb.')
                  return
            }

            const fileReader = new FileReader()
            fileReader.addEventListener('load', () => {
                  this.logo = fileReader.result
            })
            fileReader.readAsDataURL(files[0])
      },
   },
}
</script>