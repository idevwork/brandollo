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
          <span type="text">{{selected}}</span>
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
            <input
              ref="inputField"
              class="form-control"
              id="schemaField"
              type="text"
              v-model="selected"              
            >
          </div>
        </div>
      </div>
      <div class="row" v-if="errorMessage">
        <div class="col-xs-12">
          <span class="help-block text-danger">{{errorMessage}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import formFieldMixin from "@/Common/mixins/FormField";

export default {
  name: "form-long-text",
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
