<template>
    <div>
         <div v-if="disabled">
            <div v-if="disabledLabel" class="row">
                <div class="col-xs-12">
                    <label class="title">{{disabledLabel}}</label>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12">       
                <span type="text" >{{selected}} </span>          
                </div>
            </div>
        </div>
        <div v-else :class="[errorMessage ? 'has-error' : '', 'form-group']">
            <div class="row">
                <div class="col-xs-12">
                    <label class="title">{{schema.label}}</label>
                </div>
            </div>
            <div v-if="schema.description" class="row">
                <div class="col-xs-12">
                    <label class="description">
                        <span v-html="marked(schema.description)"></span>
                    </label>
                </div>
            </div>
            <div class="row">
    
                <div class="col-xs-12">
                    <div class="controls">
    
                        <div class="pretty p-icon p-round p-jelly check-box col-12">
                            <input ref="inputField" type="radio" id="yes" value="true" v-model="selected">
                            <div class="state p-primary">
                                <font-awesome-icon icon="check" class="icon"/>
                                <label>Yes</label>
                            </div>
                        </div>
    
                        <div class="pretty p-icon p-round p-jelly check-box col-12">
                            <input type="radio" id="no" value="false"  v-model="selected">
                            <div class="state p-primary">
                                <font-awesome-icon icon="check" class="icon"/>
                                <label>No</label>
                            </div>
    
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="row" v-if="errorMessage">
                <div class="col-xs-12">
                <span class="help-block text-danger">
                        {{errorMessage}}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import formFieldMixin from "@/Common/mixins/FormField";

export default {
  name: "form-boolean",
  mixins: [formFieldMixin],
  data() {
    return {
      selected: null
    };
  },
  mounted() {    
    this.validation(() => {
        if (this.options != null && this.options.validState != null) {
        if (this.options.validState == this.selected) {
          return true;
        }
        this.$data.errorMessage = this.options.validErrorMessage;
        return false;
      }
      return true;
    });
  },
  methods: {    
  }
};
</script>

<style scoped>

</style>
