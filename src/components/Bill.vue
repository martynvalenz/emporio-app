<template>
   <div>
      <q-dialog v-model="billing_dialog" maximized persistent transition-show="slide-up" transition-hide="slide-down">
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
                        v-if="!customer_disabled"
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
                        <template v-slot:after v-if="customer_id">
                           <q-btn round dense flat icon="sync" @click="customerSelect" :loading="customerLoading" />
                        </template>
                     </q-select>
                     <q-input v-if="customer_disabled" v-model="customer_name" label="Cliente" readonly outlined>
                        <template v-slot:append>
                           <q-btn round dense flat icon="edit" @click="ChangeCustomer" />
                        </template>
                     </q-input>
                     <div class="text-subtitle2 text-red" v-for="error in errors.customer_id" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-select v-model="type" label="Tipo" @input="hasTax" outlined :options="types" emit-value option-value="id" map-options option-label="type" />
                     <div class="text-subtitle2 text-red" v-for="error in errors.type" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input v-model="folio" label="Folio" outlined>
                        <template v-slot:before v-if="type">
                           <q-btn round dense flat icon="done_outline" color="green" @click="CheckFolio" />
                           <q-tooltip content-class="bg-green-9" content-style="font-size: 14px">Revisar disponibilidad de folio</q-tooltip>
                        </template>
                        <template v-slot:append v-if="type">
                           <q-btn round dense flat icon="save" color="orange" @click="SavePendient(0)" />
                           <q-tooltip content-class="bg-orange-9" content-style="font-size: 14px">Guardar folio como Pendiente</q-tooltip>
                        </template>
                        <template v-slot:after v-if="type">
                           <q-btn round dense flat icon="save" color="negative"  @click="SavePendient(2)"/>
                           <q-tooltip content-class="bg-red-14" content-style="font-size: 14px">Guardar folio como Cancelado</q-tooltip>
                        </template>
                     </q-input>
                     <div class="text-subtitle2 text-red" v-for="error in errors.folio" :key="error">
                        {{error}}
                     </div>
                  </div>
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
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 q-pa-xs">
                     <q-input v-model="comments" outlined label="Comentarios (opcional)" type="textarea" />
                     <div class="text-subtitle2 text-red" v-for="error in errors.comments" :key="error">
                        {{error}}
                     </div>
                  </div>
               </div>
            </q-card-section>
            <q-card-section>
               <div class="row" v-if="bill_id && pending_services.length > 0 && services.length > 0">
                  <div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 col-xl-10 q-pa-xs">
                     <q-select v-model="pending_service" label="Agregar servicio a factura/recibo" outlined :options="pending_services" emit-value option-value="id" map-options option-label="service" @input="getServicePendingAmmount">
                        <template v-slot:append v-if="pending_service">
                           <q-btn round dense flat icon="close" color="negative"  @click="ResetAnotherService"/>
                        </template>
                     </q-select>
                     <div class="text-subtitle2 text-red" v-for="error in errors.pending_service" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input v-model="pending_ammount" label="Monto" outlined type="number" step="any" min="0">
                        <template v-slot:after>
                           <q-btn round dense flat icon="add" color="positive"  @click="addAnotherService"/>
                        </template>
                     </q-input>
                     <div class="text-subtitle2 text-red" v-for="error in errors.pending_ammount" :key="error">
                        {{error}}
                     </div>
                  </div>
               </div>
               <div class="row q-my-md" v-if="customer_id">
                  <q-btn round push color="grey" icon="sync" @click="Refresh"/>
               </div>
               <q-markup-table wrap-cells v-if="services.length > 0">
                  <thead>
                     <tr>
                        <th class="text-left" style="width:12%;">Fecha</th>
                        <th class="text-left" style="width:28%;">Servicio</th>
                        <th class="text-left" style="width:5%;">Resp</th>
                        <th class="text-center" style="width:10%;">Cobranza</th>
                        <th class="text-center" style="width:10%;">Trámite</th>
                        <th class="text-right" style="width:10%;">Pendiente</th>
                        <th class="text-right" style="width:10%;" v-if="bill_id">Facturado</th>
                        <th class="text-right" style="width:10%;" v-else>Monto</th>
                        <th style="width:15%;"></th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr v-for="(service, index) in services" :key="index">
                        <td :title="service.id">{{ service.date }}</td>
                        <td>{{ service.code }}<span v-if="service.brand"> - {{ service.brand }}</span><span v-if="service.class"> {{service.class}}</span></td>
                        <td>{{ service.resp }}</td>
                        <td v-if="service.status < 3" class="text-center">
                           <q-chip v-if="service.is_payed == 1" size="sm" color="orange" dark label="Pendiente"/>
                           <q-chip v-if="service.is_payed == 2" size="sm" color="green" dark label="Pagado">
                              <q-tooltip content-class="bg-blue-grey-10" content-style="font-size: 14px">{{service.date_payed}}</q-tooltip>
                           </q-chip>
                        </td>
                        <td v-else class="text-center">
                           <q-chip v-if="service.is_payed == 3" size="sm" color="negative" dark label="Cancelado"/>
                           <q-chip v-if="service.is_payed == 3" size="sm" color="negative" dark label="No Registro"/>
                           <q-chip v-if="service.is_payed == 3" size="sm" color="negative" dark label="Repetido"/>
                        </td>
                        <!-- Div -->
                        <td class="text-center">
                           <q-chip v-if="service.status == 1" size="sm" color="orange" dark label="Pendiente"/>
                           <q-chip v-if="service.status == 2" size="sm" color="green" dark label="Terminado">
                              <q-tooltip content-class="bg-blue-grey-10" content-style="font-size: 14px">{{service.date_registered}}</q-tooltip>
                           </q-chip>
                           <q-chip v-if="service.status == 3" size="sm" color="negative" dark label="Cancelado"/>
                           <q-chip v-if="service.status == 4" size="sm" color="negative" dark label="No Registro"/>
                           <q-chip v-if="service.status == 5" size="sm" color="negative" dark label="Repetido"/>
                        </td>
                        <!-- Status -->
                        <td class="text-right">{{ service.pending_biller }}</td>
                        <td class="text-right">
                           {{service.biller}} <q-icon name="edit" color="orange" />
                           <q-popup-edit v-model.number="service.biller" content-class="bg-secondary text-white">
                              <q-input type="number" v-model.number="service.biller" dense autofocus />
                           </q-popup-edit>
                        </td>
                        <td class="text-right">
                           <q-btn icon="save" color="positive" push round size="sm" v-if="service.bill_id && service.det_id"/>
                           <q-btn icon="close" color="negative" push round size="sm" v-if="service.bill_id && service.det_id" @click="deleteService(index)"/>
                           <q-btn icon="close" color="negative" push round size="sm" v-if="!service.bill_id && !service.det_id" @click="Delete(index)"/>
                        </td>
                     </tr>
                  </tbody>
               </q-markup-table>
            </q-card-section>
            <q-card-section>
               <div class="row">
                  <q-btn label="Guardar Factura/Recibo" icon-right="save" color="positive" @click="Save" :loading="loading" class="q-ma-xs" />
                  <q-btn v-if="bill_id" label="Liberar Factura" icon-right="settings_backup_restore" color="orange" @click="Free" :loading="loading_free" class="q-ma-xs" />
                  <q-btn v-if="bill_id" label="Cancelar Factura" icon-right="block" color="negative" @click="Cancel" :loading="loading_cancel" class="q-ma-xs" />
               </div>
            </q-card-section>
            <q-card-section>
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
                     <q-markup-table>
                        <tbody>
                           <tr>
                              <td><div class="text-h6">Subtotal</div></td>
                              <td class="text-right" v-if="!bill_id"><div class="text-h6">$ {{formatPrice(calculated)}}</div></td>
                              <td class="text-right" v-if="bill_id"><div class="text-h6">$ {{formatPrice(subtotal)}}</div></td>
                           </tr>
                           <tr>
                              <td><q-checkbox class="text-h6" label="%IVA" color="primary" v-model="has_tax" :disable="has_tax_readonly" @change="updateTAX" :true-value="1" :false-value="0"></q-checkbox></td>
                              <td class="text-right"><div class="text-h6">{{tax_percent}}</div></td>
                           </tr>
                           <tr>
                              <td><div class="text-h6">IVA</div></td>
                              <td class="text-right" v-if="!bill_id"><div class="text-h6">$ {{formatPrice(taxCalc)}}</div></td>
                              <td class="text-right" v-if="bill_id"><div class="text-h6">$ {{formatPrice(tax)}}</div></td>
                           </tr>
                           <tr>
                              <td><div class="text-h6">Total</div></td>
                              <td class="text-right" v-if="!bill_id"><div class="text-h6">$ {{formatPrice(totalCalc)}}</div></td>
                              <td class="text-right" v-if="bill_id"><div class="text-h6">$ {{formatPrice(total)}}</div></td>
                           </tr>
                        </tbody>
                     </q-markup-table>
                  </div>
               </div>
            </q-card-section>
            <q-separator inset v-if="bill_id" />
            <q-card-section v-if="bill_id">
               <div class="row">
                  <div class="col-xs-12">
                     <div class="text-h6">Capturar ingresos del cliente</div>
                  </div>
               </div>
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input v-model="ammount" label="Monto" type="number" step="any" min="0" outlined />
                     <div class="text-subtitle2 text-red" v-for="error in errors.ammount" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-6 col-sm-6 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input outlined v-model="date_payed" label="Fecha" clearable clear-icon="close" readonly>
                        <template v-slot:append>
                           <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                 <q-date v-model="date_payed" @input="() => $refs.qDateProxy.hide()" :locale="locale">
                                 </q-date>
                              </q-popup-proxy>
                           </q-icon>
                        </template>
                     </q-input>
                     <div class="text-subtitle2 text-red" v-for="error in errors.date" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input v-model="movement" label="# Movimiento" outlined />
                     <div class="text-subtitle2 text-red" v-for="error in errors.movement" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-input v-model="check" label="Cheque" outlined />
                     <div class="text-subtitle2 text-red" v-for="error in errors.check" :key="error">
                        {{error}}
                     </div>
                  </div>
               </div>
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 q-pa-xs">
                     <q-select v-model="account_id" label="Cuenta *" @input="setPaymentMethod" outlined :options="accounts" emit-value option-value="id" map-options option-label="alias" clearable />
                     <div class="text-subtitle2 text-red" v-for="error in errors.account_id" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 q-pa-xs">
                     <q-select v-model="paying_method_id" label="Forma de pago *" outlined :options="paying_methods" emit-value option-value="id" map-options option-label="paying_method" clearable />
                     <div class="text-subtitle2 text-red" v-for="error in errors.paying_method_id" :key="error">
                        {{error}}
                     </div>
                  </div>
               </div>
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 q-pa-xs">
                     <q-input v-model="paying_comments" outlined label="Comentarios (opcional)" type="textarea" />
                     <div class="text-subtitle2 text-red" v-for="error in errors.paying_comments" :key="error">
                        {{error}}
                     </div>
                  </div>
               </div>
               <div class="row">
                  <q-btn label="Generar Ingreso" icon-right="money" color="primary" @click="Income" :loading="income_loading" class="q-ma-xs" />
               </div>
            </q-card-section>
            <q-separator inset v-if="bill_id" />
            <q-card-section v-if="bill_id">
               <div class="row">
                  <div class="col-xs-12">
                     <div class="text-h6">Pago de Factura/Recibo</div>
                  </div>
               </div>
               <div class="row" v-show="paying_alert">
                  <q-banner class="bg-yellow-4 text-black">
                     <template v-slot:avatar>
                        <q-icon name="error" color="negative" />
                     </template>
                     <p>El monto a pagar es menor que el saldo disponible del cliente, ¿desea continuar con el pago o cancelar el pago y capturar otro ingreso del cliente?</p>
                     <template v-slot:action>
                        <q-btn push color="positive" label="Continuar" @click="ContinuePayment" />
                        <q-btn push color="negative" label="Cancelar" @click="CancelPayment" />
                     </template>
                  </q-banner>
               </div>
               <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 q-pa-xs">
                     <q-input v-model="customers_balance" outlined label="Saldo del cliente" readonly />
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 q-pa-xs">
                     <q-input v-model="balance" outlined label="Monto pendiente de factura/recibo" readonly />
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 q-pa-xs">
                     <q-input v-model="bill_pending" outlined label="Monto a pagar" type="number" step="any" min="0" />
                     <div class="text-subtitle2 text-red" v-for="error in errors.bill_pending" :key="error">
                        {{error}}
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 q-pa-xs">
                     <q-btn v-if="bill_pending > 0" label="Pagar Factura/Recibo" icon-right="check" color="positive" @click="PayLoad" :loading="pay_load" class="q-ma-xs full-width" />
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
         bill_id:'',
         from_bill:1,//1.Service 2.Bill 3.Receipt 4.Pending
         customer_disabled:false,
         billing_dialog:false,
         customer_name:'',
         errors:{},
         title:'',
         //Customer
         customers:[],
         customer:'',
         customerLoading:false,
         sync_customer:'',
         customer_id:'',
         //Date
         loading: false,
         loading_free: false,
         loading_cancel: false,
         date: new Date().toISOString().substr(0, 10),
         date_menu:false,
         //Folio type
         type:'',
         types:[
               {id:'Factura', type:'Factura'},
               {id:'Recibo', type:'Recibo'}
         ],
         folio:'',
         comments:'',
         services:[],
         // billed_services:[],
         loading_services:false,
         has_tax:0,
         has_tax_readonly:false,
         tax_percent:0,
         tax:0,
         subtotal:0,
         balance:0,
         total:0,
         status:0,
         calculated_subtotal:0,
         service_selected:'',
         payed_ammount:0,
         pending_services:[],
         pending_service:'',
         pending_ammount:0,
         pending_ammount_verify:0,
         pending_ammount_billing:0,
         pending_final_price:0,
         //Payment
         ammount:0,
         date_payed:new Date().toISOString().substr(0, 10),
         date_payed_menu:false,
         movement:'',
         check:'',
         account_id:'',
         accounts:[],
         paying_method_id:'',
         paying_methods:[],
         paying_comments:'',
         income_loading:false,
         //Pay Bill
         customers_balance:0,
         customer_payment:0,
         bill_pending:0,
         pay_load:false,
         paying_alert:false,
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

   computed:{
      calculated: function(){
         if(this.services.length > 0){
            return this.services.reduce(function(total, item){
               return (total * 1) + (item.biller * 1)
            }, 0)
         }
         else{
            return 0
         }
      },

      taxCalc: function(){
         const tax_percent = this.tax_percent
         if(this.services.length > 0 && this.has_tax){
            return this.services.reduce(function(tax, item){
               return (tax * 1) + (((item.biller * 1) * ((tax_percent * 1) / 100)) * 1)
            }, 0)
         }
         else{
            return 0
         }
      },

      totalCalc: function(){
         const tax_percent = this.tax_percent
         if(this.services.length > 0){
            if(this.has_tax){
               return this.services.reduce(function(total, item){
                  return (total * 1) + (((item.biller * 1) * (1 + ((tax_percent * 1) / 100))) * 1)
               }, 0)
            }
            else{
               return this.services.reduce(function(total, item){
                  return (total * 1) + ((item.biller * 1))
               }, 0)
            }
         }
         else{
            return 0
         }
      },
   },

   methods:{
      addBill(from_bill){
         this.from_bill = from_bill
         this.billing_dialog = true
         this.title = 'Agregar Recibo/Factura'
         this.clearData()
         this.getTax()
         this.getBillLastFolio()
      },

      addBillAlready(customer_id, customer, type, from_bill){
         this.from_bill = from_bill;
         this.billing_dialog = true;
         this.title = 'Agregar Recibo/Factura';
         if(customer_id){
            this.customer_disabled = true;
            this.customer_id = customer_id;
            this.customer_name = customer;
         }
         else{
            this.customer_disabled = false;
         }
         this.total = 0;
         this.type = type;
         this.errors = {};
         this.bill_id = '';
         this.folio = '';
         this.status = 0;
         this.date = new Date().toISOString().substr(0, 10);
         this.customers = {};
         this.customer = null;
         this.pending_service = '';
         this.pending_ammount = 0;
         this.pending_ammount_verify = 0;
         this.pending_ammount_billing = 0;
         this.pending_final_price = 0;
         this.getTax();
         if(type == 'Factura'){
            this.has_tax = true;
            this.has_tax_readonly = true;
         }
         else if(type == 'Recibo'){
            this.has_tax = false;
            this.has_tax_readonly = false;
         }
         this.getPendingServices();
         this.getCustomersBalance();
         this.getBillLastFolio();
      },

      async editBill(bill_id, from_bill){
         this.clearData();
         this.bill_id = bill_id;
         if(bill_id){
            await this.$axios.get(`${process.env.API}/bill/edit/${bill_id}`)
            .then(res => {
               this.from_bill = from_bill;
               this.billing_dialog = true;
               this.title = 'Editar folio: ' + res.data.folio;
               this.customer_disabled = true;
               this.status = res.data.status;
               this.customer_id = res.data.customer_id;
               this.customer_name = res.data.customer;
               this.customer_balance = res.data.customer_balance;
               this.type = res.data.type;
               this.folio = res.data.folio;
               this.date = res.data.bill_date;
               this.tax_percent = res.data.tax_percent;
               this.subtotal = res.data.subtotal;
               this.tax = res.data.tax;
               this.total = res.data.total;
               this.is_payed = res.data.is_payed;
               this.balance = res.data.balance;
               this.payed_ammount = res.data.payed_ammount;
               this.ammount = res.data.balance;
               this.bill_pending = res.data.balance;
               this.pending_service = '';
               this.pending_ammount = 0;
               this.pending_ammount_verify = 0;
               this.pending_ammount_billing = 0;
               this.pending_final_price = 0;
               this.errors = {};
               this.customers = {};
               this.customer = null;
               this.has_tax = res.data.has_tax
               if(res.data.type == 'Factura'){
                  this.has_tax_readonly = true;
               }
               else if(res.data.type == 'Recibo'){
                  this.has_tax_readonly = false;
               }
               this.paying_alert = false;
               if(res.data.total == 0){
                  this.getPendingServices();
               }
               else{
                  this.getBillServices();
               }
               this.getAccounts();
               this.getCustomersBalance();
            })
         }
      },

      clearData(){
         this.errors = {}
         this.bill_id = ''
         this.customer_disabled = false
         this.customer_name = ''
         this.type = ''
         this.folio = ''
         this.date = new Date().toISOString().substr(0, 10)
         this.customers = {}
         this.services = {}
         this.pending_services = {}
         this.loading_services = false
         this.status = 0
         // this.billed_services = {}
         this.customer_id = ''
         this.customer = null
         this.paying_alert = false
         this.pending_service = ''
         this.pending_ammount = 0
         this.pending_ammount_verify = 0
         this.pending_ammount_billing = 0
         this.pending_final_price = 0
      },

      async getTax(){
         await this.$axios.get(`${process.env.API}/tax`)
         .then(res => {
               this.tax_percent = res.data.tax_percent
         })
      },

      async getBillLastFolio(){
         if(!this.bill_id && this.type){
            await this.$axios.post(`${process.env.API}/bills/get-folio`, {type:this.type})
            .then(res => {
               this.folio = res.data
               this.errors = {}
            })
         }
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
         this.customer_name = this.customers[0].customer
         this.getPendingServices()
         this.getCustomersBalance()
         this.errors = {}
      },

      ClearCustomer(){
         this.customers = []
         this.customer_id = ''
         this.customer_name = ''
         this.brand_id = ''
         this.brands = []
         this.services = []
      },

      ChangeCustomer(){
         if(this.services.length == 0 || !this.customer_id){
            this.customer_disabled = false
            this.customers = []
            this.customer_id = ''
            this.customer_name = ''
            this.customers_balance = 0
         }
         else{
            this.customer_disabled = true
            this.$q.notify({
               message:'No se puede cambiar al cliente en una factura que ya tiene servicios asociados.',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         }
      },

      async getPendingServices(){
         this.loading_services = true
         this.services = []
         if(this.customer_id){
            await this.$axios.post(`${process.env.API}/services/pending-bills`, {customer_id:this.customer_id})
            .then(res => {
               this.services = res.data
               this.loading_services = false
            })
         }
      },

      async getCustomersBalance(){
         if(this.customer_id){
            await this.$axios.get(`${process.env.API}/customers-balance/${this.customer_id}`)
            .then(res => {
               this.customers_balance = res.data.balance
               if((this.customers_balance + this.payed_ammount) > this.total){
                  this.ammount = 0
               }
               else{
                  this.ammount = this.total - this.customers_balance - this.payed_ammount
               }
            })
         }
      },

      hasTax(){
         if(this.type == 'Factura'){
            this.has_tax = 1
            this.has_tax_readonly = true
            this.updateTAX()
         }
         else if(this.type == 'Recibo'){
            this.has_tax = 0
            this.has_tax_readonly = false
            this.updateTAX()
         }
         else{
            this.has_tax = 0
            this.has_tax_readonly = false
            this.updateTAX()
         }
         this.getBillLastFolio()
      },

      updateTAX(){
         if(this.bill_id){
            this.$axios.put(`${process.env.API}/bill/update-tax/${this.bill_id}`, {has_tax:this.has_tax, tax_percent:this.tax_percent})
            .then(res => {
               if(this.from_bill == 2 || this.from_bill == 3){
                  this.$emit('updateBill', res.data)
               }
               else{
                  this.subtotal = res.data.subtotal
                  this.tax = res.data.tax
                  this.total = res.data.total
                  this.is_payed = res.data.is_payed
                  this.balance = res.data.balance
                  this.payed_ammount = res.data.payed_ammount
                  this.ammount = res.data.total
                  this.bill_pending = res.data.balance
               }
            })
         }
      },

      ModifyDate(){
         this.date_payed = new Date().toISOString().substr(0, 10)
      },

      async CheckFolio(){
         await this.$axios.post(`${process.env.API}/bill-verify`, {folio:this.folio, type:this.type})
            .then(res => {
            this.errors = {}
            this.$q.notify({
               message:'El folio está disponible.',
               color:'positive',
               position:'top',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
         .catch(error => {
            this.errors = error.response.data.errors
            this.errors.folio = error.response.data.errors.folio
            this.$q.notify({
               message:error.response.data.errors.folio,
               color:'negative',
               position:'top',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
      },

      Refresh(){
         if(this.bill_id){
            this.getBillServices()
         }
         else{
            this.getPendingServices()
         }
      },

      async getBillServices(){
         this.loading_services = true
         this.services = []
         this.pending_services = []
         if(this.customer_id){
            await this.$axios.get(`${process.env.API}/bill/services/${this.bill_id}/${this.customer_id}`)
            .then(res => {
               this.services = res.data.services
               this.pending_services = []
               res.data.pending_services.forEach((value, index) => {
                  let data = []
                  var clas = ''
                  var brand = ''
                  let service = ''

                  if(value.class){
                        var clas = value.class
                  }

                  if(value.brand){
                        var brand = value.brand
                  }

                  service = '('+value.code+')'+' '+brand+' '+clas+' [$'+value.ammount+']'

                  data = {id:value.id, service:service}
                  this.pending_services.push(data)
               })
               this.loading_services = false
            })
         }
      },

      formatPrice(value) {
         let val = (value/1).toFixed(2).replace('.,', '.')
         return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      },

      SavePendient(status){
         this.loading = true;
         this.$axios.post(`${process.env.API}/bill/save-pendient`, {type:this.type, folio:this.folio, customer_id:this.customer_id, date:this.date, comments:this.comments, has_tax:this.has_tax, tax_percent:this.tax_percent, status:status})
         .then(res => {
            this.customer_id = ''
            this.comments = ''
            this.errors = {}
            this.getBillLastFolio()
            this.$emit('newBill', res.data)
            this.loading = false
            this.$q.notify({
               message:'Se guardó el registro exitosamente.',
               color:'positive',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
         .catch(error => {
            this.errors = error.response.data.errors
            this.$q.notify({
               message:'No se pudo guardar el registro, revise los errores en el formulario.',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
            this.loading = false
         })
      },

      async Save(){
         this.loading = true
         if(this.bill_id){
            await this.$axios.put(`${process.env.API}/bill/update/${this.bill_id}`, {customer_id:this.customer_id, type:this.type, folio:this.folio, date:this.date, tax_percent:this.tax_percent, has_tax:this.has_tax, services:this.services, services_length:this.services.length})
            .then(success => {
               this.bill_id = success.data.id
               this.customer_disabled = true
               this.customer_name = success.data.customer
               this.tax_percent = success.data.tax_percent
               this.subtotal = success.data.subtotal
               this.tax = success.data.tax
               this.total = success.data.total
               this.is_payed = success.data.is_payed
               this.balance = success.data.balance
               this.ammount = success.data.balance
               this.payed_ammount = success.data.payed_ammount
               this.bill_pending = success.data.balance
               this.customer_balance = success.data.customer_balance
               this.date_payed = success.data.bill_date
               this.errors = {}
               this.customers = {}
               this.customer = null
               this.editBill(this.bill_id, this.from_bill)
               this.$emit('updateServices')
               this.$emit('updateBill', success.data)
               this.getAccounts()
               this.loading = false
               this.$q.notify({
                  message:'Se guardó el registro exitosamente.',
                  color:'positive',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
            })
            .catch(error => {
               if(error.response.data.success == false){
                  this.$q.notify({
                     message:error.response.data.msg,
                     color:'negative',
                     actions: [
                        { label: 'Cerrar', color: 'white', handler: () => {  } }
                     ]
                  })
                  this.loading = false
               }else{
                  this.errors = error.response.data.errors
                  this.$q.notify({
                     message:'No se pudo guardar el registro, revise los errores en el formulario.',
                     color:'negative',
                     actions: [
                        { label: 'Cerrar', color: 'white', handler: () => {  } }
                     ]
                  })
                  this.loading = false
               }
            })
         }
         else{
            await this.$axios.post(`${process.env.API}/bill/store`, {customer_id:this.customer_id, type:this.type, folio:this.folio, date:this.date, tax_percent:this.tax_percent, has_tax:this.has_tax, services:this.services, services_length:this.services.length})
            .then(success => {
               this.bill_id = success.data.id
               this.customer_disabled = true
               this.customer_name = success.data.customer
               this.tax_percent = success.data.tax_percent
               this.subtotal = success.data.subtotal
               this.tax = success.data.tax
               this.total = success.data.total
               this.is_payed = success.data.is_payed
               this.balance = success.data.balance
               this.ammount = success.data.balance
               this.payed_ammount = success.data.payed_ammount
               this.bill_pending = success.data.balance
               this.customer_balance = success.data.customer_balance
               this.date_payed = success.data.bill_date
               this.errors = {}
               this.customers = {}
               this.customer = null
               this.getBillServices()
               this.$emit('updateServices')
               this.$emit('newBill', success.data)
               this.getAccounts()
               this.loading = false
               this.$q.notify({
                  message:'Se guardó el registro exitosamente.',
                  color:'positive',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
            })
            .catch(error => {
               if(error.response.data.success == false){
                  this.$q.notify({
                     message:error.response.data.msg,
                     color:'negative',
                     actions: [
                        { label: 'Cerrar', color: 'white', handler: () => {  } }
                     ]
                  })
                  this.loading = false
               }else{
                  this.errors = error.response.data.errors
                  this.$q.notify({
                     message:'No se pudo guardar el registro, revise los errores en el formulario.',
                     color:'negative',
                     actions: [
                        { label: 'Cerrar', color: 'white', handler: () => {  } }
                     ]
                  })
                  this.loading = false
               }
            })
         }
      },

      async getAccounts(){
         if(this.bill_id){
            await this.$axios.get(`${process.env.API}/accounts-list`)
            .then(res => {
               this.accounts = res.data.accounts
               this.paying_methods = res.data.paying_methods
            })
         }
      },

      setPaymentMethod(){
         if(this.account_id){
            if(this.account_id == 1){
               this.paying_method_id = 1
            }
            else{
               this.paying_method_id = 3
            }
         }
      },

      async getServicePendingAmmount(){
         if(this.pending_service){
            await this.$axios.get(`${process.env.API}/service/pending-ammount/${this.pending_service}`)
            .then(res => {
               this.pending_ammount = res.data.ammount * 1
               this.pending_ammount_verify = res.data.ammount * 1
               this.pending_ammount_billing = res.data.billing * 1
               this.pending_final_price = res.data.final_price * 1
            })
         }
      },

      async addAnotherService(){
         if(this.payed_ammount > this.pending_ammount_verify){
            this.errors.payed_ammount = 'El monto no puede ser mayor al monto pendiente a facturar del servicio: ' + this.pending_ammount_verify
         }
         else{
            await this.$axios.post(`${process.env.API}/bill/add-service`, {pending_ammount:this.pending_ammount, pending_service:this.pending_service, bill_id:this.bill_id, pending_ammount_billing:this.pending_ammount_billing, pending_final_price:this.pending_final_price})
            .then(res => {
               this.editBill(this.bill_id, this.from_bill)
               this.$emit('updateBill', res.data)
            })
            .catch(error => {
               this.errors = error.response.data.errors
            })
         }
      },

      ResetAnotherService(){
         this.errors = {}
         this.pending_ammount_verify = 0
         this.pending_ammount = 0
         this.pending_service = ''
      },
      
      async Free(){
         this.loading_free = true
         if(this.bill_id){
            await this.$axios.put(`${process.env.API}/bill/free/${this.bill_id}`)
            .then(res => {
               this.editBill(this.bill_id, this.from_bill)
               this.$q.notify({
                  message:'Se liberó la factura',
                  color:'positive',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
               this.errors = {}
               this.loading_free = false
               this.$emit('updateServices')
               this.$emit('updateBill', res.data)
            })
            .catch(error => {
               console.log(error)
               this.loading_free = false
            })
         }
      },

      async deleteService(index){
         let id = this.services[index].det_id
         await this.$axios.put(`${process.env.API}/bill/delete-service/${bill_id}/${id}`)
         .then(res => {

         })
         .catch(error => {
               
         })
      },

      async Cancel(){
         this.loading_cancel = true
         if(this.bill_id){
            await this.$axios.put(`${process.env.API}/bill/cancel/${this.bill_id}`)
            .then(res => {
               this.$q.notify({
                  message:'Se canceló la factura',
                  color:'positive',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
               this.errors = {}
               this.loading_cancel = false
               this.clearData()
               this.$emit('updateServices')
               this.$emit('updateBill', res.data)
               this.billing_dialog = false
            })
            .catch(error => {
               console.log(error)
               this.loading_cancel = false
               this.$q.notify({
                  message:'No se pudo cancelar la factura, inténtelo más tarde',
                  color:'negative',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
            })
         }
      },

      Delete: function(index){
         if(this.bill_id){
            const service = this.services[index]
            if(service.det_id){
               this.$axios.put(`${process.env.API}/bill/delete-service/${this.bill_id}/${service.det_id}`, {payed_ammount:service.payed_ammount, service_id:service.id, ammount:service.biller})
               .then(res => {
                  this.services.splice(index, 1)
                  this.editBill(this.bill_id, this.from_bill)
                  this.$emit('updateServices')
                  this.$emit('reloadBills')
               })
               .catch(error => {
                  console.log(error)
               })
            }
            else{
               this.services.splice(index, 1)
               this.$emit('updateServices')
               this.$emit('reloadBills')
            }
         }
         else{
               this.services.splice(index, 1)
               this.$emit('updateServices')
               this.$emit('reloadBills')
         }
      }, 

      async Income(){
         if(this.bill_id){
            this.income_loading = true
            await this.$axios.post(`${process.env.API}/account-statement/income`, {customer_id:this.customer_id, comment:this.paying_comments, date_payed:this.date_payed, cheque:this.check, movimiento:this.movement, deposit:this.ammount, tax_percent:this.tax_percent, has_tax:this.has_tax, paying_method_id:this.paying_method_id, account_id:this.account_id})
            .then(res => {
               this.customers_balance = res.data
               if(res.data >= this.balance){
                  this.bill_pending = this.balance
                  this.ammount = 0
               }
               else{
                  this.bill_pending = res.data
                  this.ammount = this.balance - res.data
               }
               this.paying_comments = ''
               this.check = ''
               this.movimiento = ''
               // this.ammount = 0
               this.paying_method_id = ''
               this.account_id = ''
               this.date_payed = new Date().toISOString().substr(0, 10)
               this.$q.notify({
                  message:'Se generó el ingreso',
                  color:'positive',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
               this.errors = {}
               this.income_loading = false
            })
            .catch(error => {
               this.errors = error.response.data.errors
               this.$q.notify({
                  message:'NO se pudo capturar el ingreso, revise los errores en el formulario',
                  color:'negative',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
               this.income_loading = false
            })
         }
      }, 

      PayLoad(){
         if(this.bill_id){
            this.pay_load = true
            if(this.bill_pending <= this.balance && this.bill_pending <= this.customers_balance){
               this.PayBill()
            }
            else if(this.bill_pending <= this.balance && this.bill_pending > this.customers_balance){
               this.paying_alert = true
               this.bill_pending = this.customers_balance
            }
            else if(this.bill_pending > this.balance){
               this.errors.bill_pending = 'El monto a pagar no puede ser mayor al monto pendiente de la factura'
               this.$q.notify({
                  message:'NO se pudo pagar la factura, revise los errores en el formulario',
                  color:'negative',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
               this.pay_load = false
            }
         }
      },

      ContinuePayment(){
         this.PayBill()
         this.paying_alert = false
      },

      CancelPayment(){
         this.paying_alert = false
         this.pay_load = false
      },

      async PayBill(){
         await this.$axios.put(`${process.env.API}/bills/paybill/${this.bill_id}`, {ammount:this.bill_pending, balance:this.balance, date_payed:this.date_payed, payed_ammount:this.payed_ammount, total:this.total, customer_id:this.customer_id})
         .then(res => {
            this.$emit('updateServices')
            this.$emit('updateBill', res.data)
            this.customers_balance = res.data.customer_balance
            this.balance = res.data.balance
            this.bill_pending = res.data.balance
            this.payed_ammount = res.data.payed_ammount
            this.$q.notify({
               message:'Se pagó la factura exitosamente',
               color:'positive',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
            this.errors = {}
            this.pay_load = false
            this.billing_dialog = false
         })
         .catch(error => {
            this.errors = error.response.data.errors
            this.$q.notify({
               message:'NO se pudo pagar la factura, revise los errores en el formulario',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
            this.pay_load = false
         })
      }
   }
}
</script>