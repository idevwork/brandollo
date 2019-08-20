<template>
<div :class="[errorMessage ? 'has-error' : '', 'form-group']">
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
        <input ref="inputField" class="form-control" id="schemaField" type="number" v-model="selected" :disabled="disabled">
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
</template>

<script>
import formFieldMixin from "@/Common/mixins/FormField";

export default {
  name: "form-number",
  mixins: [formFieldMixin],
  data() {
    return {
      selected: null
    };
  }
};
</script>

<style scoped>
</style>
