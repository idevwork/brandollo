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
            <span type="text" >{{boundValue}} </span>          
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
            <div class="col-xs-12 col-lg-6">
                <div class="controls">
                    <select ref="inputField" v-model="selected" id="select-control" class="form-control" style="height:35px">
                        <option v-for="(option, key) in schema.fieldOptionDefinition" :key="key" v-bind:value="option.id">
                            {{ option.label }}
                        </option>
                    </select>
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
import formFieldMixin from '@/Common/mixins/FormField'

export default {
  name: 'form-dropdown',
  mixins: [formFieldMixin],
  data () {
    return {      
      selected: null      
    }
  }
}
</script>

<style scoped>
</style>
