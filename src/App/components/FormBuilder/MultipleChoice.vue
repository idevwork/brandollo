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
          <span type="text">{{boundValue}}</span>
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
            <div
              v-for="(item, key) in schema.fieldOptionDefinition"
              :key="key"
              :class="prettyClasses"
            >
              <input
                v-if="allowMultiple"
                ref="inputField"
                type="checkbox"
                :id="key"
                :value="item.id"
                v-model="selected"
                :disabled="optionDisabled(item.id)"
              >
              <input
                v-else
                ref="inputField"
                type="radio"
                :id="key"
                :value="item.id"
                v-model="selected"
              >
              <div class="state p-primary">
                <font-awesome-icon icon="check" class="icon"/>
                <label>{{item.label}}</label>
              </div>
            </div>
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
  name: "form-multiple",
  mixins: [formFieldMixin],
  data() {
    return {
      selected: []
    };
  },
  mounted() {
    this.schema.fieldOptionDefinition.forEach(o => {
      if (o.default == "true") {
        this.selected.push(o.id);
      }
    });

    this.validation(() => {
      if (this.options != null && this.options.validState != null) {
        if (this.options.validState == this.selected) {
          return true;
        }
        this.errorMessage = this.options.validErrorMessage;
        return false;
      }
      return true;
    });
  },
  methods: {
    checkChange: function(value) {
      console.log(value);
    }
  },
  computed: {
    allowMultiple: function() {
      return this.options.multiple;
    },
    prettyClasses: function() {
      return {
        pretty: true,
        "p-icon": true,
        "p-round": !this.allowMultiple,
        "p-jelly": true,
        //other styles
        "check-box": true,
        "col-xs-12": true,
        "col-sm-12": true
      };
    }
  },
  methods: {
    optionDisabled: function(optionId) {
      if (!this.options.max) {
        return false;
      }

      if (this.selected.indexOf(optionId) != -1) {
        return false;
      }

      let max = this.options.max;
      let current = this.selected.length;
      if (current < max) {
        return false;
      }

      return true;
    }
  }
};
</script>

<style lang="scss">
@import "~pretty-checkbox/src/pretty-checkbox.scss";
</style>
