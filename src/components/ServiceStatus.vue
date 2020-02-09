<template>
   <div>
      <q-dialog v-model="status_dialog">
         <q-card style="width:450px; max-width: 90vw;">
            <q-form @submit.prevent="Save">
               <q-card-section>
                  <div class="row">
                     <div class="text-h6" v-if="service_status > 1">¿Deseas activar el servicio?</div>
                     <div class="text-h6" v-else>¿Deseas cancelar el servicio?</div>
                     <q-space />
                     <q-btn icon="close" v-close-popup flat round />
                  </div>
               </q-card-section>
               <q-card-section v-if="service_status < 2">
                  <div class="row">
                     <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 q-pa-xs">
                        <q-select outlined v-model="cancel_motiv" :options="motives" label="Motivo de cancelación *" emit-value option-value="status" map-options option-label="text" />
                        <div class="text-subtitle2 text-red" v-for="error in errors.cancel_motiv" :key="error">
                           {{error}}
                        </div>
                     </div>
                  </div>
                  <div class="row">
                     <div class="col-xs-12 q-pa-xs">
                        <q-input type="textarea" autogrow outlined label="Comentarios (opional)" v-model="comment" />
                     </div>
                  </div>
               </q-card-section>
               <q-card-section>
                  <div class="row">
                     <q-space />
                     <q-btn color="grey" label="Cerrar" v-close-popup class="q-ma-xs" />
                     <q-btn v-if="service_status > 1" color="positive" dark :loading="loading"  class="q-ma-xs" @click="Activate" label="Activar" icon-right="check" />
                     <q-btn v-else color="positive" dark :loading="loading" @click="Cancel" class="q-ma-xs"  label="Cancelar" icon-right="block" />
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
         service_status:0,
         service_id:'',
         color:0,
         status_dialog:false,
         loading:false,
         cancel_motiv:'',
         errors:{},
         motives:[
            {status:3, text:'Cancelar'},
            {status:4, text:'No Registro'},
            {status:5, text:'Repetido'},
         ],
         comment:'',
      }
   },

   methods:{
      ServiceChangeStatus(id, color, status){
         this.status_dialog = true
         this.service_id = id
         this.color = color
         this.service_status = status
         this.clearData()
      },

      clearData(){
         this.cancel_motiv = ''
         this.comment = ''
         this.errors = {}
      },

      Cancel(){
         this.loading = true
         this.$axios.put(`${process.env.API}/service/cancel/${this.service_id}`, {cancel_motiv:this.cancel_motiv, comment:this.comment})
         .then(res => {
            this.$emit('updateService', res.data)
            this.clearData()
            this.loading = false
            this.$q.notify({
               message: 'Se cambió el estatus del servicio',
               color:'positive',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
            this.status_dialog = false
         })
         .catch(error => {
            this.loading = false
            this.errors = error.response.data.errors
            this.$q.notify({
               message: 'No se pudo cambiar el estatus, revise los errores en el formulario',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
            this.timeout = 2000
         })
      },

      Activate(){
         this.loading = true
         this.$axios.put(`${process.env.API}/service/activate/${this.service_id}`, {comment:this.comment})
         .then(res => {
            this.$emit('updateService', res.data)
            this.clearData()
            this.loading = false
            this.$q.notify({
               message: 'Se cambió el estatus del servicio',
               color:'positive',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
            this.status_dialog = false
         })
         .catch(error => {
            this.loading = false
            this.errors = error.response.data.errors
            this.$q.notify({
               message: 'No se pudo cambiar el estatus, revise los errores en el formulario',
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