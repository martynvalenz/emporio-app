<template>
   <div>
      <q-dialog v-model="service_dialog" maximized transition-show="slide-up" transition-hide="slide-down">
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
                  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input v-model="code" label="Código *" outlined></q-input>
                     <div class="text-subtitle2 text-red" v-for="error in errors.code" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 col-xl-10 q-pa-xs">
                     <q-input v-model="service" label="Nombre del servicio *" outlined></q-input>
                     <div class="text-subtitle2 text-red" v-for="error in errors.service" :key="error">
                        {{error}}
                     </div>
                  </div>
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
         //form
         service_dialog:false,
         title:'',
         errors:[],
         loading:false,
         //Data
         service_catalog_id:'',
         code:'',
         service:'',
         categories:[],
         services_category_id:'',
         binnacles:[],
         binnacle_id:'',
         status_categories:[],
         status_category_id:'',
         status_subcategories:[],
         status_subcategory_id:'',
         coins:[],
         comments:'',
         money_exchange_id:'',
         cost:0,
         external_fee:0,
         price:0,
         authorize:false,
         additional_service:false,
         allow_finance:false,
         //sales
         sales:0,
         sales_percent:0,
         sales_ammount:0,
         sales_comission:0,
         //Operations
         operations:0,
         operations_percent:0,
         operations_ammount:0,
         operations_comission:0,
         //Management
         management:0,
         management_percent:0,
         management_ammount:0,
         management_comission:0,
         //Calculus
         fee:0,
         utility:0,
         utility_percent:0,
         //snackbar
         snackbar: false,
         snackColor: '',
         snackText: '',
      timeout: 6000,
      }
   },

   methods:{
      addService(){
         this.service_dialog = true;
         this.service_catalog_id = '';
         this.title = 'Agregar servicio al catálogo';
         this.getCatalogCategories();
         this.setComission();
         this.ClearData();
         this.CalculateValues();
      },

      ClearData(){
         this.service_catalog_id = '';
         this.code = '';
         this.service = '';
         this.services_category_id = '';
         this.binnacle_id = '';
         this.status_category_id = '';
         this.status_subcategory_id = '';
         this.comments = '';
         this.money_exchange_id = '';
         this.authorize = false;
         this.additional_service = false;
         this.allow_finance = false;
         this.cost = 0;
         this.external_fee = 0;
         this.price = 0;
         this.sales = 0;
         this.sales_comission = 0;
         this.operations = 0;
         this.operations_comission = 0;
         this.management = 0;
         this.management_comission = 0;
         this.fee = 0;
         this.utility = 0;
         this.utility_percent = 0;
         this.sales_percent = 10;
         this.sales_ammount = 0;
         this.operations_percent = 5;
         this.operations_ammount = 0;
         this.management_percent = 2;
         this.management_ammount = 0;
      },

      editService(service_id){
         this.getCatalogCategories();
         this.service_dialog = true;
         this.service_catalog_id = service_id;
         this.$axios.get(`/api/catalog/edit/${service_id}`)
         .then(res => {
               this.title = 'Editar servicio: ' + res.data.code;
               this.code = res.data.code;
               this.service = res.data.service;
               this.services_category_id = res.data.services_category_id * 1;
               this.binnacle_id = res.data.binnacle_id * 1;
               this.status_category_id = res.data.status_category_id * 1;
               this.status_subcategory_id = res.data.status_subcategory_id * 1;
               if(res.data.status_category_id){
                  this.getSubcategories();
               }
               this.comments = res.data.comments;
               this.money_exchange_id = res.data.money_exchange_id * 1;
               if(res.data.authorize == 1){
                  this.authorize = '1';
               }
               else{
                  this.authorize = '0';
               }
               if(res.data.additional_service == 1){
                  this.additional_service = '1';
               }
               else{
                  this.additional_service = '0';
               }
               if(res.data.allow_finance == 1){
                  this.allow_finance = '1';
               }
               else{
                  this.allow_finance = '0';
               }
               this.cost = (res.data.cost) * 1;
               this.external_fee = (res.data.external_fee) * 1;
               this.price = (res.data.price) * 1;
               this.sales = (res.data.sales) * 1;
               this.sales_comission = (res.data.sales_comission) * 1;
               this.operations = (res.data.operations) * 1;
               this.operations_comission = (res.data.operations_comission) * 1;
               this.management = (res.data.management) * 1;
               this.management_comission = (res.data.management_comission) * 1;

               if(res.data.sales == 0){
                  this.sales_percent = res.data.sales_comission;
                  this.sales_ammount = Math.round((res.data.sales_comission * res.data.fee) / 100);
               }
               else if(res.data.sales == 1){
                  this.sales_comission = res.data.sales_comission;
                  this.sales_percent = Math.round((res.data.sales_comission * 100) / res.data.fee);
               }

               if(res.data.operations == 0){
                  this.operations_percent = res.data.operations_comission;
                  this.operations_ammount = Math.round((res.data.operations_comission * res.data.fee) / 100);
               }
               else if(res.data.operations == 1){
                  this.operations_comission = res.data.operations_comission;
                  this.operations_percent = Math.round((res.data.operations_comission * 100) / res.data.fee);
               }

               if(res.data.management == 0){
                  this.management_percent = res.data.management_comission;
                  this.management_ammount = Math.round((res.data.management_comission * res.data.fee) / 100);
               }
               else if(res.data.management == 1){
                  this.management_comission = res.data.management_comission;
                  this.management_percent = Math.round((res.data.management_comission * 100) / res.data.fee);
               }
               
               this.fee = res.data.fee;
               this.utility = res.data.utility;
               this.utility_percent = res.data.utility_percent;
         })
         .catch(error => {
               this.service_dialog = false;
         })
      },

      async getCatalogCategories(){
         await this.$axios.get('/api/catalog-categories')
         .then(res => {
               this.categories = res.data.categories;
               this.binnacles = res.data.binnacles;
               this.status_categories = res.data.status_categories;
               this.coins = res.data.coins;
         })
         .catch(error => {
               console.log(error);
         })
      },

      async getSubcategories(){
         if(this.status_category_id){
               await this.$axios.get(`/api/catalog-subcategories/${this.status_category_id}`)
               .then(res => {
                  this.status_subcategories = res.data;
               })
         }
         else{
               this.status_subcategory_id = '';
               this.status_subcategories = {};
         }
      },

      setComission(){
         this.sales = 0;
         this.operations = 0;
         this.management = 0;
      },

      CalculateValues(){
         let utility = 0;
         const cost = this.cost;
         const price = this.price;  
         const external_fee = this.external_fee;
         let fee = (price * 1);
         let final_fee = (price * 1);
         fee = (price * 1) - (cost * 1) - (external_fee * 1);
         final_fee = (cost * 1) + (external_fee * 1);

         if(fee > 0){
               this.errors = {};

               if(this.sales == 0){
                  this.sales_ammount = Math.round((this.sales_percent * fee) / 100);
                  this.sales_comission = this.sales_percent;
               }
               else if(this.sales == 1){
                  this.sales_percent = Math.round((this.sales_ammount * 100) / fee);
                  this.sales_comission = this.sales_ammount;
               }

               if(this.operations == 0){
                  this.operations_ammount = Math.round((this.operations_percent * fee) / 100);
                  this.operations_comission = this.operations_percent;
               }
               else if(this.operations == 1){
                  this.operations_percent = Math.round((this.operations_ammount * 100) / fee);
                  this.operations_comission = this.operations_ammount;
               }

               if(this.management == 0){
                  this.management_ammount = Math.round((this.management_percent * fee) / 100);
                  this.management_comission = this.management_percent;
               }
               else if(this.management == 1){
                  this.management_percent = Math.round((this.management_ammount * 100) / fee);
                  this.management_comission = this.management_ammount;
               }

               this.fee = final_fee;
               this.utility = fee - this.operations_ammount - this.sales_ammount - this.management_ammount;
               this.utility_percent = Math.round((this.utility / price) * 100);
         }
         else if(price === 0 || fee < 0){
               this.errors = {};
               this.fee = 0;
               this.utility = 0;
               this.utility_percent = 0;

               if(this.sales == 0){
                  this.sales_ammount = 0;
                  this.sales_comission = this.sales_percent;
               }
               else if(this.sales == 1){
                  this.sales_percent = 0;
                  this.sales_comission = this.sales_ammount;
               }

               if(this.operations == 0){
                  this.operations_ammount = 0;
                  this.operations_comission = this.operations_percent;
               }
               else if(this.operations == 1){
                  this.operations_percent = 0;
                  this.operations_comission = this.operations_ammount;
               }

               if(this.management == 0){
                  this.management_ammount = 0;
                  this.management_comission = this.management_percent;
               }
               else if(this.management == 1){
                  this.management_percent = 0;
                  this.management_comission = this.management_ammount;
               }
         }
      },

      ValidateSave(){
         this.loading = true;
         let cost = (this.cost * 1);
         let price = (this.price * 1);
         let sales = (this.sales_comission * 1);
         let operations = (this.operations_comission * 1);
         let management = (this.management_comission * 1);

         var fee = price - (cost + sales + operations + management);

         if(price < 0){
               this.snackbar = true;
               this.snackColor = 'error';
               this.snackText = 'El precio del servicio no puede ser negativo';
               this.errors.price = 'El precio del servicio no puede ser negativo';
               this.timeout = 2500;
               this.loading = false;
         }
         else if(price === 0 && this.authorize === '0'){
               this.snackbar = true;
               this.snackColor = 'error';
               this.snackText = 'El precio del servicio no puede ser 0, a menos que habilite la casilla de autorización';
               this.errors.price = 'Debe autorizar el precio de 0';
               this.errors.authorize = 'Debe autorizar el precio de 0';
               this.timeout = 3500;
               this.loading = false;
         }
         else if(price > 0 && fee < 0 && this.authorize === '0'){
               this.snackbar = true;
               this.snackColor = 'error';
               this.snackText = 'El costo y comisiones no pueden ser mayor al precio, a menos que habilite la casilla de autorización';
               this.errors.price = 'Debe autorizar el precio';
               this.errors.authorize = 'Debe autorizar el precio';
               this.timeout = 3500;
               this.loading = false;
         }
         else if(price >= 0 && fee <= 0 && this.authorize == '1'){
               this.Save();
         }
         else if(price > 0 && fee > 0){
               this.Save();
         }
         else{
               this.snackbar = true;
               this.snackColor = 'error';
               this.snackText = 'No se pudo guardar el registro, inténtelo más tarde.';
               this.timeout = 3500;
               this.loading = false;
         }
      },

      async Save(){

         if(this.status_category_id == 0){
               this.status_category_id = '';
         }
         if(this.status_subcategory_id == 0){
               this.status_subcategory_id = '';
         }
         if(this.binnacle_id == 0){
               this.binnacle_id = '';
         }
         if(this.services_category_id == 0){
               this.services_category_id = '';
         }

         if(this.service_catalog_id){
               await this.$axios.put(`/api/catalog/update/${this.service_catalog_id}`, {code:this.code, service:this.service, comments:this.comments, price:this.price, cost:this.cost, fee:this.fee, utility:this.utility, utility_percent:this.utility_percent, sales_comission:this.sales_comission, management_comission:this.management_comission, operations_comission:this.operations_comission, sales:this.sales, operations:this.operations, management:this.management, authorize:this.authorize, money_exchange_id:this.money_exchange_id, services_category_id:this.services_category_id, binnacle_id:this.binnacle_id, status_category_id:this.status_category_id, status_subcategory_id:this.status_subcategory_id, external_fee:this.external_fee, additional_service:this.additional_service, allow_finance:this.allow_finance})
               .then(res => {
                  this.$emit('updateService', res.data);
                  this.snackbar = true;
                  this.snackColor = 'success';
                  this.snackText = 'Se guardó el servicio: ' + this.code;
                  this.timeout = 1500;
                  this.errors = {};
                  this.loading = false;
                  this.service_dialog = false;
                  this.ClearData();
               })
               .catch(error => {
                  this.snackbar = true;
                  this.snackColor = 'error';
                  this.snackText = 'No se pudo guardar el registro, revise los errores en el formulario';
                  this.timeout = 1500;
                  this.loading = false;
                  this.errors = error.response.data.errors;
                  this.loading = false;
               })
         }
         else{
               await this.$axios.post('/api/catalog/store', {code:this.code, service:this.service, comments:this.comments, price:this.price, cost:this.cost, fee:this.fee, utility:this.utility, utility_percent:this.utility_percent, sales_comission:this.sales_comission, management_comission:this.management_comission, operations_comission:this.operations_comission, sales:this.sales, operations:this.operations, management:this.management, authorize:this.authorize, money_exchange_id:this.money_exchange_id, services_category_id:this.services_category_id, binnacle_id:this.binnacle_id, status_category_id:this.status_category_id, status_subcategory_id:this.status_subcategory_id, external_fee:this.external_fee, additional_service:this.additional_service, allow_finance:this.allow_finance})
               .then(res => {
                  this.$emit('newService', res.data);
                  this.snackbar = true;
                  this.snackColor = 'success';
                  this.snackText = 'Se guardó el registro exitosamente';
                  this.timeout = 1500;
                  this.errors= {};
                  this.loading = false;
                  this.service_dialog = false;
               })
               .catch(error => {
                  this.snackbar = true;
                  this.snackColor = 'error';
                  this.snackText = 'No se pudo guardar el registro, revise los errores en el formulario';
                  this.timeout = 1500;
                  this.loading = false;
                  this.errors = error.response.data.errors;
                  this.loading = false;
               })
         }
      }
   }
}
</script>