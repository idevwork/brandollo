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
        <div class="col-xs-12">
            <div class="controls">
            <div class="col-xs-2">
                <div v-for="(option, key) in scaleSteps" :key="key" class="scale pretty p-icon p-round p-jelly check-box col-xs-12">
                    <input ref="inputField" type="radio" :id="key" v-bind:value="option" v-model="selected" :disabled="disabled">
                    <div class="state p-primary">
                        <font-awesome-icon icon="check" class="icon"/>
                        <label>{{option}}</label>
                    </div>
                </div>
            </div>
            <div class="col-xs-2">
                <div class="labelDiv">
                    <span class="topLabel">{{options.minLabel}}</span>
                    <span class="bottomLabel">{{options.maxLabel}}</span>
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
</template>

<script>
import range from "lodash/range";
import formFieldMixin from "@/Common/mixins/FormField";

export default {
  name: "form-scale",
  mixins: [formFieldMixin],
  data() {
    return {
      selected: null
    };
  },
  computed: {
    scaleSteps: function() {
      return this.options.startone
        ? range(1, this.options.steps + 1)
        : range(0, this.options.steps);
    }
  }
};
</script>

<style scoped>
.labelDiv {
    height:100px;
     position: relative;
     text-align: left
}
.topLabel {
   position: absolute;
   top:0px;
}
.bottomLabel {
   position: absolute;
   bottom:0px;
}
</style>
