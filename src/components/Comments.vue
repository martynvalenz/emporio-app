<template>
   <div>
      <q-dialog v-model="comments_dialog" transition-show="slide-up" transition-hide="slide-down">
         <q-card style="width:550px; max-width: 90vw;">
            <q-bar class="bg-primary text-white" style="position:fixed; width:550px; max-width: 90vw;">
               <div class="text-h6">Comentarios</div>
               <q-space />
               <q-btn dense flat icon="close" v-close-popup>
                  <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
               </q-btn>
            </q-bar>
            <q-card-section class="q-px-lg q-mt-lg">
               <q-form @submit.prevent="Comment">
                  <div class="row">
                     <div class="col-xs-12 q-pa-xs">
                        <q-input type="textarea" v-model="comment" outlined label="Comentar" rows="3" autogrow  autofocus ref="comment" />
                        <div class="text-subtitle2 text-red" v-for="error in errors.comment" :key="error">
                        {{error}}
                        </div>
                     </div>
                     <div class="col-xs-12">
                        <q-btn label="Guardar comentario" size="sm" color="primary" type="submit" :loading="loading"/>
                     </div>
                  </div>
               </q-form>
               <q-timeline color="primary" class="q-mx-md" v-for="(comment, index) in comments" :key="index">
                  <!-- <q-timeline-entry heading body="Timeline heading" /> -->
                  <q-timeline-entry
                  :title="'['+comment.initials+'] '+comment.name+' '+comment.last_name"
                  :subtitle="comment.created"
                  :avatar="comment.avatar"
                  :body="comment.comment"
                  />
                  <div class="row" v-if="user_data.username == comment.username">
                     <div class="col-xs-12 q-pa-xs">
                        <q-btn label="Editar" size="sm" color="orange" dark class="q-ma-xs" @click="Edit(index)" />
                        <q-btn label="Eliminar" size="sm" color="negative" dark class="q-ma-xs" @click="Delete(index)" />
                     </div>
                  </div>
                  <q-separator inset />
               </q-timeline>
            </q-card-section>
         </q-card>
      </q-dialog>      
   </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
   data(){
      return{
         comment_id:'',
         selected_coment:'',
         comments_dialog:false,
         loading:false,
         comments:[],
         comment:'',
         services_control_id:'',
         binnacle_status_id:'',
         ticket_id:'',
         errors:[],
         id:'',
         type:'',//service, status
         body:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Asperiores quibusdam iste inventore porro aspernatur mollitia, numquam repudiandae, fugiat maxime sit obcaecati esse corrupti consequuntur officia alias et! Facere, exercitationem optio.'
      }
   },

   computed: {
      ...mapState('auth', ['user_data'])
   },

   methods:{
      showComments(id, binnacle_status_id, type){
         this.comments_dialog = true
         this.clearData()
         this.services_control_id = id
         this.binnacle_status_id = binnacle_status_id
         this.type = type
         this.getComments()
      },

      getComments(){
         if(this.type == 'service'){
            this.$axios.get(`${process.env.API}/comments/services/${this.services_control_id}`)
            .then(res => {
               this.comments = res.data
            })
         }
         else if(this.type == 'status'){
            this.$axios.get(`${process.env.API}/comments/status/${this.binnacle_status_id}`)
            .then(res => {
               this.comments = res.data
            })
         }
      },

      clearData(){
         this.id = ''
         this.comment = ''
         this.errors = {}
      },

      async Comment(){
         this.loading = true
         if(this.comment_id){
            await this.$axios.put(`${process.env.API}/comment/update/${this.comment_id}`, {comment:this.comment, services_control_id:this.services_control_id, binnacle_status_id:this.binnacle_status_id, ticket_id:this.ticket_id})
            .then(res => {
               this.comments.splice(this.selected_coment, 1, res.data)
               this.clearData()
               this.loading = false
            })
            .catch(error => {
               this.errors = error.response.data.errors
               this.loading = false
            })
         }
         else{
            await this.$axios.post(`${process.env.API}/comment/store`, {comment:this.comment, services_control_id:this.services_control_id, binnacle_status_id:this.binnacle_status_id, ticket_id:this.ticket_id})
            .then(res => {
               this.comments.unshift(res.data)
               this.clearData()
               this.loading = false
            })
            .catch(error => {
               this.errors = error.response.data.errors
               this.loading = false
            })
         }
      },

      Edit(index){
         const comment = this.comments[index]
         this.selected_coment = index
         this.comment_id = comment.id
         this.comment = comment.comment
         this.$refs.comment.focus()
      },

      Delete(index){
         this.$axios.put(`${process.env.API}/comment/delete/${this.comments[index].id}`)
         .then(res => {
            this.comments.splice(index,1)
            this.$q.notify({
               message:'Se eliminó el comentario',
               color:'positive',
               actions: [
                  { label: 'Cerrar', color: 'white', handler: () => {  } }
               ]
            })
         })
         .catch(error =>{
            this.$q.notify({
               message:'NO se pudo guardar la comisión, inténtelo más tarde.',
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