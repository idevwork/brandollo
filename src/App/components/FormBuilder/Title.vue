<template>
<div class="form-group">
    <div class="row">
        <div class="col-xs-12">
            <label class="section-title">{{schema.label}}</label>
        </div>
    </div> 
   <div v-if="schema.description" class="row top20">
        <div class="col-xs-12">
          <label class="description">
            <span v-html="marked(schema.description)"></span>
          </label>
        </div>
    </div>
  </div>
</template>

<script>
import formFieldMixin from '@/Common/mixins/FormField'

export default {
  name: 'form-title',  
  props: [],
  mixins: [formFieldMixin],
  data () {
    return {
     
    }
  }, 
  mounted(){
    this.validation(() => {
      return true; 
    })
  }
}
</script>

<style scoped>

.top20{
  margin-top:20px; 
}

.section-title{
  font-size: 20px
}
.description{font-size:18px}
</style>  