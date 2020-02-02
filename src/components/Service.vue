<template>
   <div>
      <q-dialog v-model="service_dialog" maximized persistent transition-show="slide-up" transition-hide="slide-down">
         <q-card>
            <q-bar class="bg-primary text-white">
               <div class="text-h6">{{title}}</div>
               <q-space />
               <q-btn dense flat icon="close" v-close-popup>
                  <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
               </q-btn>
            </q-bar>
            <q-card-section>
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-7 col-lg-6 col-xl-6 q-pa-xs">
                     <q-select
                        v-if="!service_id"
                        outlined
                        v-model="customer_id"
                        use-input
                        behavior="menu"
                        label="Seleccionar Cliente"
                        input-debounce="0"
                        :options="customers"
                        :loading="customerLoading"
                        emit-value option-value="id" map-options option-label="customer"
                        @filter="findCustomer"
                        @input="customerSelect"
                        >
                        <template v-slot:no-option>
                           <q-item>
                              <q-item-section class="text-grey">
                              No se encontraron resultados
                              </q-item-section>
                           </q-item>
                        </template>
                        <template v-slot:append>
                           <q-btn round dense flat icon="cancel" @click="ClearCustomer" />
                        </template>
                        <template v-slot:after>
                           <q-btn round dense flat icon="sync" @click="getCustomerData" :loading="customerLoading" />
                        </template>
                     </q-select>
                     <q-input v-if="service_id" v-model="customer" label="Cliente" readonly outlined />
                     <div class="text-subtitle2 text-red" v-for="error in errors.customer_id" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <q-space />
                  <div class="col-xs-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input outlined v-model="date" label="Fecha" clearable clear-icon="close" readonly>
                        <template v-slot:append>
                           <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                 <q-date v-model="date" @input="() => $refs.qDateProxy.hide()" :locale="locale">
                                 </q-date>
                              </q-popup-proxy>
                           </q-icon>
                        </template>
                     </q-input>
                     <div class="text-subtitle2 text-red" v-for="error in errors.date" :key="error">
                        {{error}}
                     </div>
                  </div>
               </div>
               <div class="row q-mt-lg">
                  <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 q-pa-xs">
                     <q-select outlined v-if="!newBrand" v-model="brand_id" :options="brands" label="Seleccionar nombre de Trámite" emit-value option-value="id" map-options option-label="brand" clearable>
                        <template v-slot:before>
                           <q-btn round dense flat icon="add" @click="newBrand = true" />
                        </template>
                     </q-select>
                     <div class="text-subtitle2 text-red" v-for="error in errors.brand_id" :key="error">
                        {{error}}
                     </div>
                     <q-input v-model="brand" v-if="newBrand" outlined>
                        <template v-slot:before>
                           <q-btn round dense flat icon="cancel" @click="newBrand = false" />
                        </template>
                        <template v-slot:after>
                           <q-btn round dense flat icon="save" @click="saveBrand" />
                        </template>
                     </q-input>
                     <div class="text-subtitle2 text-red" v-for="error in errors.brand" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 q-pa-xs">
                     <q-select outlined v-model="class_id" :options="classes" label="Clase" emit-value option-value="id" map-options option-label="class" clearable>
                        <template v-slot:after>
                           <q-btn round dense flat icon="help_outline" @click="showClass" />
                        </template>
                     </q-select>
                     <div class="text-subtitle2 text-red" v-for="error in errors.class_id" :key="error">
                        {{error}}
                     </div>
                  </div>
               </div>
            </q-card-section>
            <q-card-section v-if="related.length > 0">
               <q-markup-table wrap-cells>
                  <thead>
                     <tr>
                        <th class="text-left" style="width:15%">Fecha</th>
                        <th class="text-left" style="width:40%">Servicio</th>
                        <th class="text-right" style="width:20%">Precio</th>
                        <th class="text-center" style="width:15%">Resp</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr v-for="(service, index) in related" :key="index">
                        <td title="service.id">{{ service.date }}</td>
                        <td>{{ service.code }} - {{ service.brand }}<span v-if="service.class"> {{service.class}}</span></td>
                        <td class="text-right">$ {{ formatPrice(service.final_price) }}</td>
                        <td class="text-center">{{ service.resp }}</td>
                     </tr>
                  </tbody>
               </q-markup-table>
            </q-card-section>
            <q-card-section>
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-10 col-xl-10 q-pa-xs">
                     <q-select
                        v-if="service_select"
                        outlined
                        v-model="services_catalog_id"
                        use-input
                        behavior="menu"
                        label="Buscar Servicio"
                        input-debounce="0"
                        :options="services"
                        :loading="serviceLoading"
                        emit-value option-value="id" map-options option-label="service"
                        @filter="findService"
                        @input="serviceSelect"
                        >
                        <template v-slot:no-option>
                           <q-item>
                              <q-item-section class="text-grey">
                              No se encontraron resultados
                              </q-item-section>
                           </q-item>
                        </template>
                        <template v-slot:append>
                           <q-btn round dense flat icon="close" @click="ClearData" />
                        </template>
                        <template v-slot:after>
                           <q-btn round dense flat icon="sync" @click="getServiceData" :loading="customerLoading" />
                        </template>
                     </q-select>
                     <q-input v-if="!service_select" v-model="service" label="Servicio" readonly outlined>
                        <template v-slot:append>
                           <q-btn round dense flat icon="edit" @click="editServiceCatalog" />
                        </template>
                     </q-input>
                     <div class="text-subtitle2 text-red" v-for="error in errors.services_catalog_id" :key="error">
                        {{error}}
                     </div>
                  </div>
               </div>
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 q-pa-xs">
                     <q-select outlined v-model="responsable_id" :options="responsables" label="Seleccionar responsable" emit-value option-value="id" map-options option-label="user" clearable />
                     <div class="text-subtitle2 text-red" v-for="error in errors.responsable_id" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 q-pa-xs">
                     <q-select outlined v-model="binnacle_id" :options="binnacles" label="Seleccionar Bitácora" emit-value option-value="id" map-options option-label="binnacle" clearable />
                     <div class="text-subtitle2 text-red" v-for="error in errors.binnacle_id" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 q-pa-xs">
                     <q-select outlined v-model="status_category_id" :options="status_categories" label="Seleccionar Estatus" emit-value option-value="id" map-options option-label="category" clearable @input="getSubcategories" />
                     <div class="text-subtitle2 text-red" v-for="error in errors.status_category_id" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 q-pa-xs">
                     <q-select outlined v-model="status_subcategory_id" :options="status_subcategories" label="Seleccionar Subcategoría" emit-value option-value="id" map-options option-label="subcategory" clearable />
                     <div class="text-subtitle2 text-red" v-for="error in errors.status_subcategory_id" :key="error">
                        {{error}}
                     </div>
                  </div>
               </div>
               <q-separator inset class="q-my-md" />
               <div class="row">
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-select outlined v-model="coin_id" :options="coins" label="Moneda" emit-value option-value="id" map-options option-label="coin" @input="changeCoin" :readonly="conversion > 0" />
                     <div class="text-subtitle2 text-red" v-for="error in errors.coin_id" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input v-model="price_desc" outlined readonly label="Precio base" />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input v-model="cost" outlined label="Pago de Derechos" type="number" step="any" min="0" v-on:keyup="editCost">
                        <template v-slot:append>
                           <q-btn round dense flat icon="refresh" @click="editCost" />
                        </template>
                     </q-input>
                     <div class="text-subtitle2 text-red" v-for="error in errors.cost" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input v-model="external_fee" outlined label="Pago de Honorarios" type="number" step="any" min="0" v-on:keyup="editCost">
                        <template v-slot:append>
                           <q-btn round dense flat icon="refresh" @click="editCost" />
                        </template>
                     </q-input>
                     <div class="text-subtitle2 text-red" v-for="error in errors.external_fee" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input v-model="extra_cost" outlined label="Costos Extra" type="number" step="any" min="0">
                        <template v-slot:after>
                           <q-btn round dense flat icon="add" @click="addExtraCosts" />
                        </template>
                     </q-input>
                     <div class="text-subtitle2 text-red" v-for="error in errors.extra_cost" :key="error">
                        {{error}}
                     </div>
                  </div>
               </div>
               <div class="row">
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input v-if="coin_id == 1" v-model="conversion" outlined label="Tipo de cambio" type="number" step="any" min="0" readonly />
                     <q-input v-else v-model="conversion" outlined label="Tipo de cambio" type="number" step="any" min="0">
                        <template v-slot:append>
                           <q-btn round dense flat icon="done_outline" @click="editConversion" />
                        </template>
                     </q-input>
                     <div class="text-subtitle2 text-red" v-for="error in errors.conversion" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input v-model="discount" outlined label="Descuento" type="number" step="any" min="0" v-on:keyup="editDiscount">
                        <template v-slot:append>
                           <q-btn round dense flat icon="refresh" @click="editDiscount" />
                        </template>
                     </q-input>
                     <div class="text-subtitle2 text-red" v-for="error in errors.discount" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input v-model="discount_percent" outlined label="%Descuento" type="number" step="any" min="0" v-on:keyup="editPercentDiscount">
                        <template v-slot:append>
                           <q-btn round dense flat icon="refresh" @click="editPercentDiscount" />
                        </template>
                     </q-input>
                     <div class="text-subtitle2 text-red" v-for="error in errors.discount_percent" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input v-model="final_price" outlined label="Precio sin IVA*" type="number" step="any" min="0" v-on:keyup="FinalCut">
                        <template v-slot:append>
                           <q-btn round dense flat icon="refresh" @click="FinalCut" />
                        </template>
                     </q-input>
                     <div class="text-subtitle2 text-red" v-for="error in errors.final_price" :key="error">
                        {{error}}
                     </div>
                  </div>
               </div>
               <div class="row" v-if="show_related">
                  <div class="col-xs-12 col-sm-6 col-md-7 col-lg-5 col-xl-5 q-pa-xs">
                     <q-select outlined v-model="select_related" :options="related_services" label="Seleccionar servicio extra" emit-value option-value="id" map-options option-label="service">
                        <template v-slot:append>
                           <q-btn round dense flat icon="clear" @click="select_related = ''" />
                        </template>
                     </q-select>
                     <div class="text-subtitle2 text-red" v-for="error in errors.select_related" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input v-model="related_ammount" outlined label="Monto de honorarios" type="number" step="any" min="0">
                        <template v-slot:after>
                           <q-btn round dense flat icon="close" @click="closeRelated" />
                        </template>
                     </q-input>
                     <div class="text-subtitle2 text-red" v-for="error in errors.related_ammount" :key="error">
                        {{error}}
                     </div>
                  </div>
               </div>
            </q-card-section>
            <q-card-section>
               <div class="row">
                  <div class="col-xs-12 q-pa-xs">
                     <div class="text-h6">Comisiones <q-btn icon="refresh" flat round @click="updateComissions" /></div>
                  </div>
               </div>
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-5 col-xl-5">
                     <q-markup-table>
                        <thead>
                           <tr>
                              <th>Concepto</th>
                              <th class="text-right">Porcentaje</th>
                              <th class="text-right">Monto</th>
                              <th class="text-right">Aplica?</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td>Venta</td>
                              <td class="text-right">% {{sales_comission}}</td>
                              <td class="text-right">$ {{sales_value}}</td>
                              <td class="text-right">
                                 <q-checkbox @input="updateComissions" color="primary" v-model="sales_check" :false-value="0" :true-value="1"></q-checkbox>
                              </td>
                           </tr>
                           <tr>
                              <td>Operativa</td>
                              <td class="text-right">% {{operations_comission}}</td>
                              <td class="text-right">$ {{operations_value}}</td>
                              <td class="text-right">
                                 <q-checkbox color="primary" v-model="operations_check" :false-value="0" :true-value="1"></q-checkbox>
                              </td>
                           </tr>
                           <tr>
                              <td>Gestión</td>
                              <td class="text-right">% {{management_comission}}</td>
                              <td class="text-right">$ {{management_value}}</td>
                              <td class="text-right">
                                 <q-checkbox color="primary" v-model="management_check" @input="updateComissions" :false-value="0" :true-value="1"></q-checkbox>
                              </td>
                           </tr>
                        </tbody>
                     </q-markup-table>
                  </div>
               </div>
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 q-pa-xs">
                     <q-input v-model="comment" outlined label="Comentarios (opcional)" type="textarea" />
                     <div class="text-subtitle2 text-red" v-for="error in errors.comment" :key="error">
                        {{error}}
                     </div>
                  </div>
               </div>
            </q-card-section>
            <q-card-section class="q-ma-xl" />
            <q-card-section style="background-color:rgba(0,0,0,0.1); color: white; position:fixed; bottom: 0; width:100%;">
               <div class="row">
                  <q-space/>
                  <q-btn color="grey" label="Cerrar" v-close-popup class="q-ma-xs" />
                  <q-btn label="Guardar" icon-right="save" color="secondary" :loading="loading"  @click="SaveService" class="q-ma-xs" />
               </div>
            </q-card-section>
         </q-card>
      </q-dialog>
   </div>
</template>

<script>
export default {
   data(){
      return{
         title:'',
         service_dialog:false,
         errors:{},
         //Customer
         customers:[],
         customerLoading:false,
         customer_id:'',
         customer:'',
         //Service
         services:[],
         service:'',
         serviceLoading:false,
         sync_service:'',
         service_id:'',
         service_select:true,
         services_catalog_id:'',
         //Package
         package_id:'',
         has_package:false,
         package_total:0,
         //Data
         brand_id:'',
         brands:[],
         brand:'',
         newBrand:false,
         classes:[],
         class_id:'',
         comment:'',
         coins:'',
         coin_id:'',
         cost:0,
         external_fee:0,
         extra_cost:0,
         price:0,
         cost:'',
         conversion:0,
         conversion_base:0,
         service_discount:0,
         discount:0,
         discount_percent:0,
         final_price:0,
         const_price:0,
         fee:0,
         total_advance:0,
         status_category_id:'',
         status_subcategory_id:'',
         status_categories:[],
         status_subcategories:[],
         //Related services
         show_related:false,
         related:[],
         select_related:'',
         related_services:[],
         related_ammount:0,
         //Comisions
         sales_comission:0,
         management_comission:0,
         operations_comission:0,
         sales_id:'',
         sales:0,
         sales_force:0,
         management_id:'',
         management:0,
         operations:0,
         sales_value:0,
         management_value:0,
         operations_id:'',
         operations_value:0,
         sales_check:true,
         management_check:false,
         operations_check:true,
         //lists
         binnacles:[],
         binnacle_id:'',
         responsables:[],
         responsable_id:'',
         process:[],

         loading: false,
         date: new Date().toISOString().substr(0, 10),
         date_menu:false,
         servicesCollection:[],
         locale: {
         /* starting with Sunday */
            days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
            daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
            months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
            monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
            firstDayOfWeek: 1
         }
      }
   },

   methods:{
      addService()
      {
         this.service_dialog = true
         this.has_package = false
         this.package_total = 0
         this.related = {}
         this.title = 'Agregar Servicio'
         this.services_catalog_id = ''
         this.customer_id = ''
         this.getClasses()
         this.getBinnacles()
         this.getResponsables()
         this.getCoins()
         this.getEstatus()
         this.ClearService()
         this.ClearData()
      },

      addPackage()
      {
         this.service_dialog = true
         this.has_package = true
         this.package_total = 0
         this.title = 'Agregar Servicios'
         this.related = {}
         this.services_catalog_id = ''
         this.customer_id = ''
         this.getClasses()
         this.getBinnacles()
         this.getResponsables()
         this.getCoins()
         this.getEstatus()
         this.ClearService()
         this.ClearData()
      },

      editService(service_id){
         this.service_dialog = true
         this.service_select = false
         this.has_package = true
         this.title = 'Editar Servicio: #' + service_id
         this.service_id = service_id
         this.getClasses()
         this.getBinnacles()
         this.getResponsables()
         this.getCoins()
         this.getEstatus()
         this.$axios.get(`${process.env.API}/service/edit/${service_id}`)
         .then(res =>{
            this.customer_id = res.data.service.customer_id
            this.getBrands()
            this.customer = res.data.service.customer
            this.date = res.data.service.date
            if(res.data.service.class_id){
               this.class_id = res.data.service.class_id * 1
            }
            else{
               this.class_id = ''
            }
            if(res.data.service.brand_id){
               this.brand_id = res.data.service.brand_id
            }
            else{
               this.brand_id = ''
            }
            this.services_catalog_id = res.data.service.services_catalog_id
            this.service = res.data.service.service
            if(res.data.service.responsable_id){
               this.responsable_id = res.data.service.responsable_id * 1
            }
            else{
               this.responsable_id = ''
            }
            if(res.data.service.binnacle_id){
               this.binnacle_id = res.data.service.binnacle_id * 1
            }
            else{
               this.binnacle_id = ''
            }
            if(res.data.service.status_category_id){
               this.status_category_id = res.data.service.status_category_id * 1
               this.getSubcategories()
            }
            else{
               this.status_category_id = ''
            }
            if(res.data.service.status_subcategory_id){
               this.status_subcategory_id = res.data.service.status_subcategory_id * 1
            }
            else{
               this.status_subcategory_id = ''
            }
            this.coin_id = res.data.service.money_exchange_id * 1
            this.price_desc = res.data.service.price_desc
            this.cost = res.data.service.cost
            this.extra_cost = 0
            this.external_fee = res.data.service.external_fee
            this.conversion = res.data.service.money_exchange
            this.discount = res.data.service.discount
            this.discount_percent = res.data.service.discount_percent
            this.final_price = res.data.service.final_price
            this.comment = res.data.service.comment
            this.show_related = false
            this.related = []
            this.select_related = ''
            this.related_services = []
            this.related_ammount = 0
            //Comissions
            if(res.data.sales_comission){
               this.sales_id = res.data.sales_comission.id
               this.sales_comission = res.data.sales_comission.comission_percent
               this.sales_value = res.data.sales_comission.comission
               this.sales_check = 1
            }
            else{
               this.sales_id = ''
               this.sales_comission = 0
               this.sales_value = 0
               this.sales_check = 0
            }

            if(res.data.operations_comission){
               this.operations_id = res.data.operations_comission.id
               this.operations_comission = res.data.operations_comission.comission_percent
               this.operations_value = res.data.operations_comission.comission
               this.operations_check = 1
            }
            else{
               this.operations_id = ''
               this.operations_comission = 0
               this.operations_value = 0
               this.operations_check = 0
            }

            if(res.data.management_comission){
               this.management_id = res.data.management_comission.id
               this.management_comission = res.data.management_comission.comission_percent
               this.management_value = res.data.management_comission.comission
               this.management_check = 1
            }
            else{
               this.management_id = ''
               this.management_comission = 0
               this.management_value = 0
               this.management_check = 0
            }
               
         })
         .catch(error => {
            console.log(error)
            this.service_dialog = false
            this.$q.notify({
               message:'Hubo un error en el formulario, intente más tarde',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
      },

      findCustomer(val, update, abort){
         this.customerLoading = true
         update(() => {
            this.$axios.post(`${process.env.API}/service/customers`, {search:val})
            .then(res => {
               this.customers = res.data
               this.customerLoading = false
            })
            .catch(error =>{
               this.customerLoading = false
            })
         })
      },

      customerSelect(){
         this.getBrands()
         this.getPendingServices()
         this.errors = {}
      },

      ClearCustomer(){
         this.customers = []
         this.customer_id = ''
         this.brand_id = ''
         this.brands = []
         this.related = []
      },

      findService(val, update, abort){
         this.serviceLoading = true
         update(() => {
            this.$axios.post(`${process.env.API}/services/list`, {search:val})
            .then(res => {
               this.services = res.data
               this.serviceLoading = false
            })
            .catch(error =>{
               console.log(error)
               this.serviceLoading = false
            })
         })
      },

      serviceSelect(){
         this.getServiceData()
         this.getRequirements()
         this.errors = {}
      },

      editServiceCatalog(){
         this.service_select = true
         this.services_catalog_id = ''
         this.services = []
         this.ClearData()
      },

      getCustomerData(){
         this.getBrands()
         this.getPendingServices()
      },

      async getBrands(){
         if(this.customer_id){
            await this.$axios.post(`${process.env.API}/service/customer-brands`, {customer_id:this.customer_id})
            .then(res => {
               this.brands = res.data
            })
            .catch(error => {
               this.errors = error.response.data.errors
            })
         }
      },

      async getPendingServices(){
         if(this.customer_id){
            await this.$axios.get(`${process.env.API}/customer/pending-services/${this.customer_id}`)
            .then(res => {
               this.related = res.data
            })
         }
      },

      changeCoin(){
         let coin = this.coins[this.coin_id -1]
         this.conversion = coin.conversion
         this.editConversion()
      },

      updateComissions(){
         if(!this.service_id){
            if(this.management_comission){
               if(this.management == 0){
                  this.management_comission = this.management_comission
                  this.management_value = Math.round((this.management_comission * this.fee) / 100)
               }
               else{
                  this.management_value = this.management_comission * conversion
                  this.management_comission = Math.round((this.management_value / this.fee) * 100)
               }
            }

            if(this.sales_comission){
               if(this.sales == 0){
                  this.sales_comission = this.sales_force
                  this.sales_value = Math.round((this.sales_comission * this.fee) / 100)
               }
               else{
                  this.sales_value = this.sales_force * conversion
                  this.sales_comission = Math.round((this.sales_value / this.fee) * 100)
               }
            }

            if(this.operations_comission){
               if(this.operations == 0){
                  this.operations_comission = this.operations_comission
                  this.operations_value = Math.round((this.operations_comission * this.fee) / 100)
               }
               else{
                  this.operations_value = this.operations_comission * conversion
                  this.operations_comission = Math.round((this.operations_comission / this.fee) * 100)
               }
            }

            if(this.management_check){
               if(this.sales_value == 0){
                  
               }
               else if(this.management_value == 0)
               {
                  
               }
               else if(this.sales_value < this.management_value){
                  this.sales_value = 0
                  this.sales_comission = 0
               }
               else{
                  this.sales_value = this.sales_value - this.management_value
                  this.sales_comission = Math.round(((this.sales_value / this.fee) * 100) * 100) / 100
               }
            }
         }
         else{
               
         }
      },

      async getServiceData(){
         if(this.services_catalog_id){
            await this.$axios.post(`${process.env.API}/services/data`, {id:this.services_catalog_id, customer_id:this.customer_id})
            .then(res => {
               this.errors = {}
               const conversion = res.data.service.conversion
               //General Data
               if(res.data.service.binnacle_id){
                  this.binnacle_id = res.data.service.binnacle_id * 1
               }
               else{
                  this.binnacle_id = ''
               }
               if(res.data.service.status_category_id){
                  this.status_category_id = res.data.service.status_category_id * 1
               }
               else{
                  this.status_category_id = ''
               }
               this.coin_id = res.data.service.money_exchange_id * 1
               this.total_advance = res.data.service.total_advance
               this.price_desc = res.data.service.price + ' ' + res.data.service.code
               this.price = res.data.service.price
               if(this.status_category_id){
                  this.getSubcategories()
                  if(res.data.service.status_subcategory_id){
                  this.status_subcategory_id = res.data.service.status_subcategory_id * 1
                  }
                  else{
                        this.status_subcategory_id = ''
                  }
               }

               //Discounts
               const discount = (res.data.service.price * conversion) * ((res.data.discount * conversion) / 100)
               this.discount_percent = res.data.discount
               this.discount = Math.round(discount * 100) / 100

               //Totals
               this.external_fee = Math.round((res.data.service.external_fee * conversion) * 100) / 100
               this.conversion = conversion
               this.conversion_base = conversion
               this.cost = res.data.service.cost * conversion
               this.final_price = Math.round(((res.data.service.price * conversion) - discount) * 100) / 100
               this.const_price = Math.round(((res.data.service.price * conversion) - discount) * 100) / 100
               this.fee = Math.round(((res.data.service.price * conversion) - (res.data.service.cost * conversion) - (res.data.service.external_fee * conversion) - discount) * 100)/100

               //Comissions
               this.sales = res.data.service.sales
               this.management = res.data.service.management
               this.operations = res.data.service.operations

               if(res.data.service.management_comission){
                  if(res.data.service.management == 0){
                        this.management_comission = res.data.service.management_comission
                        this.management_value = Math.round((res.data.service.management_comission * this.fee) / 100)
                  }
                  else{
                        this.management_value = res.data.service.management_comission * conversion
                        this.management_comission = Math.round((this.management_value / this.fee) * 100)
                  }
               }

               if(res.data.service.sales_comission){
                  if(res.data.service.sales == 0){
                        this.sales_comission = res.data.service.sales_comission
                        this.sales_force = res.data.service.sales_comission
                        this.sales_value = Math.round((res.data.service.sales_comission * this.fee) / 100)
                  }
                  else{
                        this.sales_value = res.data.service.sales_comission * conversion
                        this.sales_force = res.data.service.sales_comission * conversion
                        this.sales_comission = Math.round((this.sales_value / this.fee) * 100)
                  }
               }

               if(res.data.service.operations_comission){
                  if(res.data.service.operations == 0){
                        this.operations_comission = res.data.service.operations_comission
                        this.operations_value = Math.round((res.data.service.operations_comission * this.fee) / 100)
                  }
                  else{
                        this.operations_value = this.operations_comission * conversion
                        this.operations_comission = Math.round((this.operations_comission / this.fee) * 100)
                  }
               }

               if(this.management_check){
                  if(this.sales_value == 0){
                        
                  }
                  else if(this.management_value == 0)
                  {
                        
                  }
                  else if(this.sales_value < this.management_value){
                        this.sales_value = 0
                        this.sales_comission = 0
                  }
                  else{
                        this.sales_value = this.sales_value - this.management_value
                        this.sales_comission = Math.round(((this.sales_value / this.fee) * 100) * 100) / 100
                  }
               }
            })
         }
         else{
            this.errors.services_catalog_id = 'Seleccione un servicio'
         }
      },

      editPercentDiscount(){
         if(this.discount_percent){
            if(this.discount_percent >= 100){
               this.errors.discount_percent = 'El porcentaje no puede ser mayor a 100%'
            }
            else{
               this.errors = {}
               const value = this.const_price - (this.const_price * (this.discount_percent / 100)) - this.cost - this.external_fee
               if(value < 0){
                  this.errors.discount_percent = 'El descuento no puede ser mayor a los honorarios del servicio'
               }
               else{
                  this.discount = this.const_price * (this.discount_percent / 100)
                  this.final_price = this.const_price - this.discount
                  this.fee = this.final_price - this.cost
                  this.calculateComission()
               }
            }
         }
      },

      editDiscount(){
         if(this.discount){
            this.errors = {}
            const value = this.const_price - this.cost - this.discount
            if(value < 0){
               this.errors.discount = 'El descuento no puede ser mayor a los honorarios del servicio.'
            }
            else{
               this.final_price = (this.const_price * 1) - (this.discount * 1)
               this.fee = this.final_price - this.cost
               this.discount_percent = Math.round(((this.discount / this.const_price) * 100) *100)/100
               this.calculateComission()
            }
         }
      },

      editCost(){
         if(this.cost){
            const value = this.const_price - this.cost - this.discount
            if(value < 0){
               this.errors.cost = 'El costo no puede ser mayor al precio del servicio.'
            }
            else{
               this.errors = {}
               this.fee = value
               this.calculateComission()
            }
         }
      },

      FinalCut(){
         if(this.final_price){
            const value = this.final_price - this.cost - this.discount - this.external_fee
            if(value < 0){
               this.errors.final_price = 'El precio no puede ser menor a la suma de pago de derechos + descuento + honorarios'
            }
            else{
               this.errors = {}
               this.fee = value
               this.const_price = (this.final_price * 1) + (this.discount * 1)
               this.discount_percent = Math.round(((this.discount / this.const_price) * 100) *100)/100
               this.calculateComission()
            }
         }
      },

      async editConversion(){
         if(this.conversion){
            if(this.conversion > 0){
               await this.$axios.put(`${process.env.API}/change-money/${this.coin_id}`, {conversion:this.conversion})
               .then(res => {
                  this.errors = {}
                  this.final_price = Math.round((this.final_price * this.conversion / this.conversion_base) * 100) / 100
                  this.cost = Math.round((this.cost * this.conversion / this.conversion_base) * 100) / 100
                  this.discount = Math.round((this.discount * this.conversion / this.conversion_base) * 100) / 100
                  this.const_price = Math.round((this.const_price * this.conversion / this.conversion_base) * 100) / 100
                  this.fee = Math.round((this.fee * this.conversion / this.conversion_base) * 100) / 100
                  this.external_fee = Math.round((this.fee * this.conversion / this.conversion_base) * 100) / 100
                  this.calculateComission()
                  this.conversion_base = res.data.conversion
                  this.$q.notify({
                     message:'Se actualizó el tipo de cambio para ' + res.data.code,
                     color:'positive',
                     actions: [
                        { label: 'Cerrar', color: 'white', handler: () => {  } }
                     ]
                  })

               })
               .catch(error => {
                  this.errors = error.response.data.errors
               })
            }
         }
      },

      calculateComission(){
         if(this.management_comission){
            if(this.management == 0){
               this.management_value = Math.round((this.management_comission * this.fee) / 100)
            }
            else{
               this.management_comission = Math.round((this.management_value / this.fee) * 100)
            }
         }

         if(this.sales_comission){
            if(this.management_check == true){
               if(this.sales == 0){
                  this.sales_comission = this.sales_comission - this.management_comission
                  this.sales_value = Math.round((this.sales_comission * this.fee) / 100)
               }
               else{
                  this.sales_value = this.sales_comission * conversion - this.management_value
                  this.sales_comission = Math.round((this.sales_value / this.fee) * 100)
               }
            }
            else if(this.management_check == false){
               if(this.sales == 0){
                  this.sales_comission = this.sales_comission
                  this.sales_value = Math.round((this.sales_comission * this.fee) / 100)
               }
               else{
                  this.sales_value = this.sales_comission * conversion
                  this.sales_comission = Math.round((this.sales_value / this.fee) * 100)
               }
            }
         }

         if(this.operations_comission){
            if(this.operations == 0){
               this.operations_comission = this.operations_comission
               this.operations_value = Math.round((this.operations_comission * this.fee) / 100)
            }
            else{
               this.operations_value = this.operations_comission * conversion
               this.operations_comission = Math.round((this.operations_comission / this.fee) * 100)
            }
         }
      },

      ClearData(){
         this.service_select = true
         this.services = {}
         this.service_id = ''
         // this.services_catalog_id = ''
         // this.package_id = ''
         this.coin_id = ''
         this.cost = 0
         this.extra_cost = 0
         this.price = 0
         this.price_desc = 0
         this.fee = 0
         this.external_fee = 0
         this.conversion = 0
         this.conversion_base = 0
         this.discount = 0
         this.discount_percent = 0
         this.final_price = 0
         this.const_price = 0
         this.const_price = 0
         this.sales_id = ''
         this.sales_comission = 0
         this.sales_value = 0
         this.management_id = ''
         this.management_comission = 0
         this.management_value = 0
         this.operations_id = ''
         this.operations_comission = 0
         this.operations_value = 0
         this.binnacle_id = ''
         this.process = []
         this.total_advance = 0
         this.status_category_id = ''
         this.status_subcategory_id = ''
         //Related
         this.show_related = false
         // this.related = []
         this.select_related = ''
         this.related_services = []
         this.related_ammount = 0
         this.sales_check = 1
         this.operations_check = 1
         this.management_check = 1
      },

      ClearService(){
         this.customers = []
         this.customer_id = ''
         this.date = new Date().toISOString().substr(0, 10)
         this.brands = {}
         this.newBrand = false
         this.brand_id = ''
         this.class_id = ''
         this.binnacle_id = ''
         this.responsable_id = ''
         this.comment = ''
         this.management_check = false
         this.sales_check = true
         this.operations_check = true
         this.total_advance = 0
         this.status_category_id = ''
         this.status_subcategory_id = ''
         // this.related = {}
      },

      ReloadService(){
         this.ClearData()
         this.services_catalog_id = ''
         this.class_id = ''
         this.binnacle_id = ''
         this.comment = ''
         this.total_advance = 0
         this.status_category_id = ''
         this.status_subcategory_id = ''
      },

      async getClasses(){
         await this.$axios.get(`${process.env.API}/classes-list`)
         .then(res => {
            this.classes = res.data
         })
      },

      async getBinnacles(){
         await this.$axios.get(`${process.env.API}/binnacles-list`)
         .then(res => {
            this.binnacles = res.data
         })
      },

      async getCoins(){
         await this.$axios.get(`${process.env.API}/money-list`)
         .then(res => {
            this.coins = res.data
         })
      },

      async getEstatus(){
         await this.$axios.get(`${process.env.API}/get-categories`)
         .then(res => {
            this.status_categories = res.data
         })
      },

      async getSubcategories(){
         if(this.status_category_id){
            await this.$axios.get(`${process.env.API}/get-subcategories/${this.status_category_id}`)
            .then(res => {
               this.status_subcategory_id = ''
               this.status_subcategories = res.data
            })
         }
      },

      formatPrice(value) {
         let val = (value/1).toFixed(2).replace('.,', '.')
         return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      },

      async getResponsables(){
         await this.$axios.get(`${process.env.API}/responsables`)
         .then(res => {
               this.responsables = res.data
         })
      },

      async getRequirements(){
         if(this.services_catalog_id){
            await this.$axios.get(`${process.env.API}/services/requirements/${this.services_catalog_id}`)
            .then(res => {
               this.process = res.data
               this.total_advance = this.process.length
            })
         }
      },
      
      clearForm(){
         this.customer_id = ''
      },

      async saveBrand(){
         await this.$axios.post(`${process.env.API}/customer/brand`, {brand:this.brand, customer_id:this.customer_id})
         .then(res => {
            this.brands.unshift(res.data)
            this.newBrand = false
            this.brand_id = res.data.id
            this.brand = ''
            this.errors = {}
            this.$q.notify({
               message:'Se agregó la marca o nombre comercial',
               color:'positive',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
         .catch(error => {
            this.errors = error.response.data.errors
            this.$q.notify({
               message:'No se pudo guardar el registro, revise los errores en el formulario',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })   
         })
      },

      async Save(){
         await this.$axios.post(`${process.env.API}/customer`, {customer:this.customer, strategy_id:this.strategy_id, referred_by:this.referred_by})
         .then(res => {
            this.loading = false
            this.clearForm()
            this.service_dialog = false
            this.$q.notify({
               message:'Se agregó el cliente '+res.data.customer,
               color:'positive',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
         .catch(error => {
            this.loading = false
            this.errors = error.response.data.errors
            this.error_alert = true
            this.$q.notify({
               message:'No se pudo guardar el registro, revise los errores en el formulario',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
      },

      async showClass(){
         if(this.class_id){
            await this.$axios.get(`${process.env.API}/show-class-description/${this.class_id}`)
            .then(res => {
               this.$q.notify({
                  message:res.data.description,
                  color:'purple',
                  position:'top',
                  timeout: 10000,
                  multiLine: true,
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
            })
         }
         else{
            this.$q.notify({
               message:'Seleccione una clase',
               color:'negative',
               position:'top',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         }
      },

      async addExtraCosts(){
         if(this.services_catalog_id){
            this.show_related = true
            await this.$axios.get(`${process.env.API}/services-additional`)
            .then(res => {
               this.related_ammount = this.extra_cost
               this.related_services = res.data
            })
         }
         else{
            this.$q.notify({
               message:'Seleccione un servicio',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         }
      },

      closeRelated(){
         this.show_related = false
         this.related_ammount = 0
         this.extra_cost = 0
         this.related_services = {}
         this.select_related = ''
      },

      async getRelatedServiceData(){
         await this.$axios.post(`${process.env.API}/service-additional/data`, {related_ammount:this.related_ammount, select_related:this.select_related})
         .then(res=> {
            this.related.unshift(res.data)
            this.errors = {}
            this.related_ammount = 0
            this.select_related = ''
         })
         .catch(error => {
            this.errors = error.response.data.errors
         })
      },

      deleteRelated: function(index){
         if(this.service_id){
               
         }
         else{
            this.related.splice(index,1)
         }
      },

      async SaveService(){
         if(this.service_id){
            this.loading = true
            await this.$axios.put(`${process.env.API}/service/update/${this.service_id}`, {comment:this.comment, date:this.date, cost:this.cost, price:this.price, money_exchange:this.conversion, discount:this.discount, discount_percent:this.discount_percent, final_price:this.final_price, advance_total:this.total_advance, money_exchange_id:this.coin_id, customer_id:this.customer_id, brand_id:this.brand_id, services_catalog_id:this.services_catalog_id, responsable_id:this.responsable_id, binnacle_id:this.binnacle_id, class_id:this.class_id, sales:this.sales, management:this.management, operations:this.operations, sales_comission:this.sales_comission, operations_comission:this.operations_comission, management_comission:this.management_comission, process:this.process, sales_check:this.sales_check, operations_check:this.operations_check, management_check:this.management_check, sales_value:this.sales_value, operations_value:this.operations_value, management_value:this.management_value, status_category_id:this.status_category_id, status_subcategory_id:this.status_subcategory_id, external_fee:this.external_fee, utility:this.fee, has_package:this.has_package, package_id:this.package_id, package_total:this.package_total})
            .then(res => {
               this.errors = {}
               this.$q.notify({
                  message:'Se editó el servicio exitosamente',
                  color:'positive',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
               this.$emit('updateService', res.data)
               this.loading = false
               this.ReloadService()
               this.service_dialog = false
            })
            .catch(error => {
               // console.clear()
               this.errors = error.response.data.errors
               this.$q.notify({
                  message:'No se pudo actualizar el servicio, revise los errores en el formulario.',
                  color:'negative',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
               this.loading = false
            })
         }
         else{
            this.loading = true
            await this.$axios.post(`${process.env.API}/service/store`, {comment:this.comment, date:this.date, cost:this.cost, price:this.price, money_exchange:this.conversion, discount:this.discount, discount_percent:this.discount_percent, final_price:this.final_price, advance_total:this.total_advance, money_exchange_id:this.coin_id, customer_id:this.customer_id, brand_id:this.brand_id, services_catalog_id:this.services_catalog_id, responsable_id:this.responsable_id, binnacle_id:this.binnacle_id, class_id:this.class_id, sales:this.sales, management:this.management, operations:this.operations, sales_comission:this.sales_comission, operations_comission:this.operations_comission, management_comission:this.management_comission, process:this.process, sales_check:this.sales_check, operations_check:this.operations_check, management_check:this.management_check, sales_value:this.sales_value, operations_value:this.operations_value, management_value:this.management_value, status_category_id:this.status_category_id, status_subcategory_id:this.status_subcategory_id, external_fee:this.external_fee, utility:this.fee, has_package:this.has_package, package_id:this.package_id, related_ammount:this.related_ammount, select_related:this.select_related})
            .then(res => {
               this.errors = {}
               this.related = res.data.services
               this.package_id = res.data.package_id
               this.$emit('addService', res.data.service.original)
               if(this.select_related){
                  this.$emit('addService', res.data.service_related.original)
               }
               this.$q.notify({
                  message:'Se guardó el servicio exitosamente',
                  color:'positive',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
               this.loading = false
               this.ReloadService()
               if(!this.has_package){
                  this.service_dialog = false
               }
            })
            .catch(error => {
               // console.clear()
               this.errors = error.response.data.errors
               this.$q.notify({
                  message:'No se pudo generar el servicio, revise los errores en el formulario.',
                  color:'negative',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
               this.loading = false
            })
         }
      }
   }
}
</script>