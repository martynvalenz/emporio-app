<template>
   <div>
      <q-drawer :breakpoint="767" :width="550" show-if-above v-model="rightDrawer" behavior="mobile" side="right" elevated>
         <q-scroll-area class="fit">
            <q-card>
               <q-card-section>
                  <q-btn @click="clearClose" flat icon="close" round />
                  <q-list>
                     <q-item>
                        <q-item-section>
                           {{customer}}
                        </q-item-section>
                     </q-item>
                     <q-item>
                        <q-item-section>
                           {{service}}
                        </q-item-section>
                     </q-item>
                     <q-item>
                        <q-item-section>
                           <q-knob
                              disable
                              v-model="advance_percent"
                              show-value
                              size="90px"
                              :thickness="0.22"
                              color="positive"
                              track-color="grey-3"
                              class="text-positive q-ma-md"
                           />
                        </q-item-section>
                     </q-item>
                     <q-item v-if="progress.length == 0">
                        <q-item-section>
                           <p>El servicio no tiene proceso</p>
                           <q-btn color="positive" @click="GenerateProcess" :loading="loading_generate" label="Generar Proceso"></q-btn>
                        </q-item-section>
                     </q-item>  
                     <q-item v-if="asign_cost == 1">
                        <q-item-section side top>
                           <q-checkbox v-model="manage_cost" :false-value="0" :true-value="1" color="orange" :disable="payed_cost == 1" @input="ManageCost" />
                        </q-item-section>
                        <q-item-section>
                           Gestionar pago de derechos: {{formatPrice(cost)}}
                        </q-item-section>
                     </q-item> 
                     <q-separator inset/>
                     <q-item v-ripple  v-for="(prog, index) in progress" :key="index" >
                        <q-item-section side top>
                           <q-checkbox v-model="prog.status" :true-value="1" :false-value="0" color="primary"  @input="Check(index, prog.status)" :disable="loading_check" />
                        </q-item-section>
                        <q-item-section>
                           <q-item-label>{{prog.requisite}}</q-item-label>
                           <q-item-label caption v-if="prog.status == 1">
                              {{prog.created_at}} - {{prog.name}} {{prog.last_name}}
                           </q-item-label>
                        </q-item-section>
                     </q-item>
                  </q-list>
               </q-card-section>
               <q-card-section v-if="advance == advance_total">
                  <q-btn color="primary" label="Enviar a estatus" icon-right="send"></q-btn>
               </q-card-section>
            </q-card>
         </q-scroll-area>
      </q-drawer>
   </div>
</template>

<script>
export default {
   data(){
      return {
         skeleton:false,
         rightDrawer:false,
         loading_generate:false,
         loading_check:false,
         service:'',
         progress:[],
         service_id:'',
         services_catalog_id:'',
         customer:'',
         asign_cost:0,
         manage_cost:0,
         payed_cost:0,
         cost:0,
         is_payed:0,
         advance:0,
         advance_total:0,
         advance_percent:0
      }
   },

   methods:{
      openProgress(id){
         this.skeleton = true
         this.progress.splice(0, this.progress.length)
         this.rightDrawer = true
         this.service_id = id
         this.getServicesProgress()
      },

      async getServicesProgress(){
         await this.$axios.get(`${process.env.API}/binnacles/service/${this.service_id}`)
         .then(res => {
            let brand = ''
            let classer = ''
            if(res.data.service.class){
               classer = res.data.service.class
            }
            else if(res.data.service.brand){
               classer = res.data.service.brand
            }
            this.service =  '('+res.data.service.id+') '+res.data.service.code+' - '+brand+' '+classer
            this.customer = res.data.service.customer
            this.asign_cost = res.data.service.asign_cost
            this.manage_cost = res.data.service.manage_cost * 1
            this.payed_cost = res.data.service.payed_cost
            this.cost = res.data.service.cost
            this.advance = res.data.service.advance
            this.advance_total = res.data.service.advance_total
            this.advance_percent = Math.round(res.data.service.advance_percent)
            this.services_catalog_id = res.data.service.services_catalog_id
            this.is_payed = res.data.service.is_payed
            res.data.progress.forEach((value, index) => {
               let data = []

               var status = ''
               status = value.status * 1

               data = {id:value.id, status:status, sales:value.sales, operations:value.operations, management:value.management, register:value.register, requisite:value.requisite, created_at:value.created_at, name:value.name, last_name:value.last_name, orden:value.orden, initials:value.initials, admin:value.admin, user_id:value.user_id, category:this.category}
               this.progress.push(data)
            })
            this.skeleton = false
         })
      },

      clearClose(){
         this.Clear()
         this.rightDrawer = false
      },

      Clear(){
         this.progress.splice(0, this.progress.length)
      },

      async ManageCost(){
         await this.$axios.put(`${process.env.API}/binnacles/manage-cost/${this.service_id}`, {manage_cost:this.manage_cost})
         .then(res => {
            this.cost = res.data.cost
         })
         .catch(error => {
            this.manage_cost = !this.manage_cost
         })
      },

      async Check(index, status){
         this.loading_check = true
         const check = this.progress[index]

         await this.$axios.put(`${process.env.API}/binnacles/check-list/${check.id}`, {status:status, sales:check.sales, operations:check.operations, management:check.management, register:check.register, service_control_id:this.service_id, advance:this.advance, advance_total:this.advance_total})
         .then(res => {
            this.progress[index].created_at = res.data.progress.original.created_at
            this.progress[index].name = res.data.progress.original.name
            this.progress[index].last_name = res.data.progress.original.last_name
            this.advance = res.data.service.original.advance
            this.advance_percent = Math.round(res.data.service.original.advance_percent)
            this.$emit('updateProgress', res.data.service.original)
            this.loading_check = false
         })
         .catch(error => {
            this.$q.notify({
               message:'No se pudo realizar la acción, inténtelo más tarde',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
            this.loading_check = false

            this.clearClose()
         })
      },

      async GenerateProcess(){
         this.loading_generate = true
         await this.$axios.post(`${process.env.API}/binnacles/generate-process`, {id:this.service_id, services_catalog_id:this.services_catalog_id})
         .then(res => {
            if(this.res.data.progress.length > 0){
               this.progress = res.data
               this.advance_percent = Math.round(res.data.service.advance_percent)
               this.loading_generate = false
               this.$q.notify({
                  message:'Se generó el proceso del servicio',
                  color:'positive',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
            }
            else if(this.res.data.progress.length == 0){
               this.loading_generate = false
               this.$q.notify({
                  message:'No se pudo generar el proceso debido a que el servicio no tiene asignados pasos en el catálogo de servicios.',
                  color:'negative',
                  actions: [
                     { label: 'Cerrar', color: 'white', handler: () => {  } }
                  ]
               })
            }
            
         })
         .catch(error => {
            this.loading_generate = false
            this.$q.notify({
               message:'No se pudo generar el proceso, inténtelo más tarde',
               color:'negative',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
      },

      formatPrice(value) {
      let val = (value/1).toFixed(2).replace('.,', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
   },
   }
}
</script>