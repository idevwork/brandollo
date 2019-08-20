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
          <!-- <input ref="inputField" class="form-control" id="schemaField" type="number" v-model="selected" :disabled="disabled"> -->
          <datetime
            v-model="selected"
            class="theme-hestia"
            :min-datetime="minDate(null)"
            value-zone="utc"
            :zone="userDetails.profile.zoneinfo"
          ></datetime>
        </div>
      </div>
    </div>
    <div class="row" v-if="errorMessage">
      <div class="col-xs-12">
        <span class="help-block text-danger">{{errorMessage}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import "vue-datetime/dist/vue-datetime.css";
import formFieldMixin from "@/Common/mixins/FormField";
import { Datetime } from "vue-datetime";
import { mapState } from "vuex";
import { addDay } from "@/Common/functions/Dates";

export default {
  name: "form-date",
  mixins: [formFieldMixin],
  components: {
    datetime: Datetime
  },
  computed: {
    ...mapState({
      userDetails: state => state.userStore.user
    })
  },
  data() {
    return {
      selected: null,
      format: "dd/MM/yy"
    };
  },
  methods: {
    minDate(date) {
      return addDay(date);
    }
  }
};
</script>

<style >
.theme-hestia .vdatetime-popup__header,
.theme-hestia .vdatetime-calendar__month__day--selected > span > span,
.theme-hestia .vdatetime-calendar__month__day--selected:hover > span > span {
  background: #e91e63;
}

.theme-hestia .vdatetime-year-picker__item--selected,
.theme-hestia .vdatetime-time-picker__item--selected,
.theme-hestia .vdatetime-popup__actions__button {
  color: #e91e63;
}

.theme-hestia .vdatetime-input {
  border: 1px solid #d9e3e9 !important;
  border-radius: 4px;
  max-width: 100%;
  padding: 0.469rem 0.75rem;
  font-size: 14px;
  -webkit-box-shadow: none;
  box-shadow: none;
  -webkit-transition: all 300ms linear;
  transition: all 300ms linear;
  cursor: pointer;
}
</style>
