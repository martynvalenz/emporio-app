<template>
   <q-page padding>
      <div class="row">
         <div class="text-h5">Bitácoras</div>
         <q-space/>
         <q-breadcrumbs class="align-right">
            <q-breadcrumbs-el label="Dashboard" icon="dashboard" to="/admin" />
            <q-breadcrumbs-el label="Bitácoras" icon="bookmarks" />
         </q-breadcrumbs>
      </div>
      <q-card class="q-mt-md">
         <q-card-section>
            <q-btn label="Agregar Bitácora" icon-right="add" color="secondary" />
         </q-card-section>
         <q-card-section>
            <q-markup-table wrap-cells>
               <thead>
                  <tr>
                     <th class="text-left">Clave</th>
                     <th class="text-left">Bitácora</th>
                     <th class="text-center">Servicios</th>
                     <th class="text-center">Estatus</th>
                     <th class="text-center">Agregada</th>
                     <th class="text-right"></th>
                  </tr>
               </thead>
               <tbody>
                  <tr v-for="(reg, index) in binnacles" :key="index">
                     <td>{{ reg.key }}</td>
                     <td>{{ reg.binnacle }}</td>
                     <td class="text-center">{{ reg.services }}</td>
                     <td class="text-center">
                        <q-chip v-if="reg.status == 1" color="positive" dark>Activo</q-chip>
                        <q-chip v-else color="negative" dark>Inactivo</q-chip>
                     </td>
                     <td class="text-center">{{ reg.created_at }}</td>
                     <td class="text-right">
                        <q-btn round class="q-ma-xs" color="orange" icon="edit" size="sm" />
                        <q-btn round class="q-ma-xs" color="negative" v-if="reg.status = 1" icon="block" size="sm" />
                        <q-btn round class="q-ma-xs" color="positive" v-else icon="check" size="sm" />
                     </td>
                  </tr>
               </tbody>
            </q-markup-table>
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
         //Data
         binnacles:[],
         loading_table:false,
      }
   },

   created(){
      this.Load();
   },

   methods:{
      async Load(){
         this.loading_table = true;
         await this.$axios.get(`${process.env.API}/binnacles`)
         .then(res => {
               this.binnacles = res.data;
               this.loading_table = false;
         })
         .catch(error => {
               this.loading_table = false;
               console.log(error)
         })
      }
   } 
   
}
</script>