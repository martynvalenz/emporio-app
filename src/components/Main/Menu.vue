<template>
   <q-scroll-area class="fit">
      <q-list>
         <q-item clickable v-ripple to="/admin/profile" exact router>
            <q-item-section avatar>
               <q-avatar clickable v-ripple>
                  <img :src="user_data.avatar_img" style="border-radius:50%;">
               </q-avatar>
            </q-item-section>
            <q-item-section>
               {{user_data.name}} {{user_data.last_name}}
               <small>Ir a perfil</small>
            </q-item-section>
         </q-item>
         <q-item-label header>Principal</q-item-label>
         <q-item clickable v-ripple to="/admin" exact router>
            <q-item-section avatar>
               <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>
               Dashboard
            </q-item-section>
         </q-item>

         <q-expansion-item expand-separator icon="event_seat" label="Dirección" disabled>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Autorizar Servicios
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="beenhere" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Comisiones
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="money" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Sueldos
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="money" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Bancos
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="account_balance" />
               </q-item-section>
            </q-item>
         </q-expansion-item>

         <q-expansion-item expand-separator icon="bar_chart" label="Indicadores" disabled>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Indicadores
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="bar_chart" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Metas
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="touch_app" />
               </q-item-section>
            </q-item>
         </q-expansion-item>

         <q-item-label header>Servicios</q-item-label>

         <q-expansion-item expand-separator icon="work" label="Servicios">
            <q-item clickable v-ripple to="/admin/services/categories" exact router class="q-pl-xl" expand-separator>
               <q-item-section>
                  Categorías
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="category" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/admin/services/subcategories" exact router class="q-pl-xl" expand-separator>
               <q-item-section>
                  Subcategorías
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="device_hub" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/admin/services/binnacles" exact router class="q-pl-xl" expand-separator>
               <q-item-section>
                  Bitácoras
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="bookmarks" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/admin/services/catalog" exact router class="q-pl-xl" expand-separator>
               <q-item-section>
                  Catálogo de Servicios
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="chrome_reader_mode" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/admin/services/comissions" exact router class="q-pl-xl" expand-separator>
               <q-item-section>
                  Catálogo de Comisiones
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="money" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Descuentos
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="money_off" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Pago de Derechos
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="attach_money" />
               </q-item-section>
            </q-item>
         </q-expansion-item>

         <q-expansion-item expand-separator icon="people" label="Clientes">
            <q-item clickable v-ripple to="/admin/customers/strategies" exact router class="q-pl-xl" expand-separator>
               <q-item-section>
                  Estrategias
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="thumb_up" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/admin/customers/customers" exact router class="q-pl-xl" expand-separator>
               <q-item-section>
                  Listado de Clientes
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="people_outline" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Marcas
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="copyright" />
               </q-item-section>
            </q-item>
         </q-expansion-item>

         <q-item clickable v-ripple to="/admin/services/services-control" exact router>
            <q-item-section avatar>
               <q-icon name="business_center" />
            </q-item-section>
            <q-item-section>
               Control de Servicios
            </q-item-section>
         </q-item>

         <q-item clickable v-ripple to="/admin/services/binnacles-procedures" exact router>
            <q-item-section avatar>
               <q-icon name="bookmarks" />
            </q-item-section>
            <q-item-section>
               Bitácoras
            </q-item-section>
         </q-item>

         <q-item clickable v-ripple to="/admin/services/status" exact router>
            <q-item-section avatar>
               <q-icon name="assignment" />
            </q-item-section>
            <q-item-section>
               Estatus de Trámites
            </q-item-section>
         </q-item>

         <!-- <q-expansion-item expand-separator icon="assignment" label="Estatus de Trámites">
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Signos Distintivos
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Declaraciones de Uso
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Búsqueda Técnica
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Invenciones
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Dictamen Previo
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Códigos de Barra
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Registro de Obras
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Reserva de Derechos
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Juicios
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Franquicias
               </q-item-section>
            </q-item>
         </q-expansion-item> -->
         
         <q-expansion-item expand-separator icon="money" label="Comisiones">
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Asignadas
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="money" color="green" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Sin Asignar
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="money" color="orange" />
               </q-item-section>
            </q-item>
         </q-expansion-item>

         <q-item-label header>Administración</q-item-label>

         <q-expansion-item expand-separator icon="insert_drive_file" label="Facturación">
            <q-item clickable v-ripple to="/admin/bills/bills" exact router class="q-pl-xl" expand-separator>
               <q-item-section>
                  Facturas
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="description" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/admin/bills/receipts" exact router class="q-pl-xl" expand-separator>
               <q-item-section>
                  Recibos
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="receipt" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Cuentas por Cobrar
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="account_balance_wallet" />
               </q-item-section>
            </q-item>
         </q-expansion-item>

         <q-expansion-item expand-separator icon="money" label="Finanzas">
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Ingresos
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="money" color="green" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Egresos
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="money" color="negative" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Tarjetas de Crédito
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="credit_card" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Cuentas por Pagar
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="account_balance_wallet" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Bancos
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="account_balance" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Nómina y Comisiones
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="assignment_ind" />
               </q-item-section>
            </q-item>
         </q-expansion-item>

         <q-expansion-item expand-separator icon="timeline" label="Histórico">
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Servicios
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="business_center" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Facturas
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="description" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Recibos
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="receipt" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Ingresos
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="money" color="positive" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Egresos
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="money" color="negative" />
               </q-item-section>
            </q-item>
         </q-expansion-item>

         <q-item-label header>Ajustes</q-item-label>

         <q-expansion-item expand-separator icon="person" label="Usuarios">
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Listado de Usuarios
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="person_outline" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Puestos
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="accessibility_new" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Permisos
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="vpn_key" />
               </q-item-section>
            </q-item>
         </q-expansion-item>

         <q-expansion-item expand-separator icon="public" label="Página Web">
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Ir a página web
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="public" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Franquicias
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="store" />
               </q-item-section>
            </q-item>
         </q-expansion-item>

         <q-expansion-item expand-separator icon="settings" label="Menú Ajustes">
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Formas de Pago
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="credit_card" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Tipos de Cambio
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="monetization_on" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Porcentaje IVA
               </q-item-section>
               <q-item-section avatar>
                  %
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Clases
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="category" />
               </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator disabled>
               <q-item-section>
                  Colores de Estatus
               </q-item-section>
               <q-item-section avatar>
                  <q-icon name="palette" />
               </q-item-section>
            </q-item>
         </q-expansion-item>

         <!-- <q-item clickable v-ripple exact router>
            <q-item-section avatar>
               <q-icon name="money" />
            </q-item-section>
            <q-item-section>
               Finanzas personales
            </q-item-section>
         </q-item>
         <q-item clickable v-ripple exact router>
            <q-item-section avatar>
               <q-icon name="date_range" />
            </q-item-section>
            <q-item-section>
               Calendario
            </q-item-section>
         </q-item>
         <q-item clickable v-ripple exact router>
            <q-item-section avatar>
               <q-icon name="assignment" />
            </q-item-section>
            <q-item-section>
               Tareas
            </q-item-section>
         </q-item>
               <q-expansion-item expand-separator icon="event_seat" label="Dirección">
                  <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator>
                     <q-item-section>
                        Autorizar Servicios
                     </q-item-section>
                     <q-item-section avatar>
                        <q-icon name="beenhere" />
                     </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator>
                     <q-item-section>
                        Sueldos y Salarios
                     </q-item-section>
                     <q-item-section avatar>
                        <q-icon name="money" color="green" />
                     </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator>
                     <q-item-section>
                        Bancos
                     </q-item-section>
                     <q-item-section avatar>
                        <q-icon name="account_balance" />
                     </q-item-section>
                  </q-item>
               </q-expansion-item>

               <q-expansion-item expand-separator icon="bar_chart" label="Indicadores">
                  <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator>
                     <q-item-section>
                        Indicadores
                     </q-item-section>
                     <q-item-section avatar>
                        <q-icon name="bar_chart" />
                     </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator>
                     <q-item-section>
                        Metas
                     </q-item-section>
                     <q-item-section avatar>
                        <q-icon name="touch_app" />
                     </q-item-section>
                  </q-item>
               </q-expansion-item>

               <q-expansion-item expand-separator icon="people" label="Usuarios">
                  
               </q-expansion-item>

               <q-expansion-item expand-separator icon="account_circle" label="Mi Cuenta">
                  <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator>
                     <q-item-section>
                        Dashboard
                     </q-item-section>
                     <q-item-section avatar>
                        <q-icon name="dashboard" />
                     </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator>
                     <q-item-section>
                        Mis Empresas
                     </q-item-section>
                     <q-item-section avatar>
                        <q-icon name="account_balance" />
                     </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator>
                     <q-item-section>
                        Sucursales
                     </q-item-section>
                     <q-item-section avatar>
                        <q-icon name="store" />
                     </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator>
                     <q-item-section>
                        Estados de cuenta
                     </q-item-section>
                     <q-item-section avatar>
                        <q-icon name="account_balance_wallet" />
                     </q-item-section>
                  </q-item>
               </q-expansion-item>

               <q-expansion-item expand-separator icon="business_center" label="Catálogos">
                  <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator>
                     <q-item-section>
                        Servicios y Tratamientos
                     </q-item-section>
                     <q-item-section avatar>
                        <q-icon name="assignment" />
                     </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator>
                     <q-item-section>
                        Paquetes y Promociones
                     </q-item-section>
                     <q-item-section avatar>
                        <q-icon name="assignment_turned_in" />
                     </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator>
                     <q-item-section>
                        Laboratorios
                     </q-item-section>
                     <q-item-section avatar>
                        <q-icon name="hot_tub" />
                     </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator>
                     <q-item-section>
                        Catálogo de Egresos
                     </q-item-section>
                     <q-item-section avatar>
                        <q-icon name="style" />
                     </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple to="" exact router class="q-pl-xl" expand-separator>
                     <q-item-section>
                        Estrategias de Captación
                     </q-item-section>
                     <q-item-section avatar>
                        <q-icon name="thumb_up" />
                     </q-item-section>
                  </q-item>
               </q-expansion-item>

         <q-item-label header>Principal</q-item-label>

         <q-item clickable v-ripple to="" exact router>
            <q-item-section avatar>
               <q-icon name="date_range" />
            </q-item-section>
            <q-item-section>
               Citas
            </q-item-section>
         </q-item>
         <q-item clickable v-ripple to="" exact router>
            <q-item-section avatar>
               <q-icon name="folder_shared" />
            </q-item-section>
            <q-item-section>
               Pacientes / Clientes
            </q-item-section>
         </q-item>
         <q-item clickable v-ripple to="" exact router>
            <q-item-section avatar>
               <q-icon name="assignment_late" />
            </q-item-section>
            <q-item-section>
               Cotizaciones
            </q-item-section>
         </q-item>
         <q-item clickable v-ripple to="" exact router>
            <q-item-section avatar>
               <q-icon name="local_hospital" />
            </q-item-section>
            <q-item-section>
               Tratamientos
            </q-item-section>
         </q-item>
         <q-item clickable v-ripple to="" exact router>
            <q-item-section avatar>
               <q-icon name="dvr" />
            </q-item-section>
            <q-item-section>
               Trabajos de Laboratorio
            </q-item-section>
         </q-item>
         <q-item clickable v-ripple to="" exact router>
            <q-item-section avatar>
               <q-icon name="money" />
            </q-item-section>
            <q-item-section>
               Pagos y Bonificaciones
            </q-item-section>
         </q-item> -->
      </q-list>
   </q-scroll-area>
</template>

<script>
import {mapActions, mapState} from 'vuex'
export default {
   props:['user_data', 'permissions'],
   computed:{
      // ...mapState('auth', ['user_data']),
   },

   methods:{
      
   }
}
</script>