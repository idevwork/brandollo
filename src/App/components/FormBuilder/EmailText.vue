<template>
<div class="form-group">
    <label for="schemaField">
        <h5>{{ schema.label }}</h5>
    </label>
    <input ref="inputField" class="form-control" id="schemaField" type="text" v-model="selected" :disabled="disabled">
    <div class="has-error" v-if="errorMessage">
        <span class="help-block text-danger">
            {{errorMessage}}
        </span>
    </div>
</div>
</template>

<script>
import formFieldMixin from "@/Common/mixins/FormField";

export default {
  name: "form-email-text",
  mixins: [formFieldMixin],
  data() {
    return {
      selected: null
    };
  },
  mounted() {
    this.validation(() => {
      var re = /\S+@\S+\.\S+/;
      if (!re.test(this.$data.selected)) {
        this.$data.errorMessage = "This field requires a valid email address";
        return false;
      }
      return true;
    });
  }
};
</script>

<style scoped>
</style>
