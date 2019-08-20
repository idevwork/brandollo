import marked from 'marked';
import { find } from 'lodash';
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  props: ["fieldIndex", "pageIndex", "initValue", "disabled"],
  data() {
    return {
      errorMessage: null,
      options: null,
    };
  },
  computed: {
    ...mapState({
      formPages: s => s.question.formPages,
    }),
    ...mapGetters("question", ["getTouchStatus", "getSchema"]),
    schema() {
      return this.getSchema(this.pageIndex, this.fieldIndex);
    },
    // isTouched() {
    //   if (this.schema) {
    //     return this.getTouchStatus(this.schema.id);
    //   }
    // },
    disabledLabel() {
      if (this.disabled && this.options && this.options.disabledLabel) {
        if (this.options.disabledLabel === " ") {
          return null;
        }
        return this.options.disabledLabel;
      }
      return this.schema.label;
    },
    boundValue() {
      return find(this.schema.fieldOptionDefinition, f => { return f.id == this.selected }).label
    }
  },
  created: function () {
    if (this.initValue != null) {
      this.selected = this.initValue;
      // This triggers the watch anyway. Its fine but not ideal. 
    }
    this.options = JSON.parse(this.schema.options)
    this.componentValidFunc = () => true;
  },
  methods: {
    ...mapActions("question", [
      "updateResults",
      "updateValidation"
    ]),
    globalValidation: function () {
      if (this.schema.required && (this.selected === null || !/\S/.test(this.selected))) {
        this.errorMessage = "This field is required";
        return false;
      }
      return true;
    },
    validation: function (valFunc) {
      this.componentValidFunc = valFunc;
    },
    marked: function (input) {
      return input ? marked(input) : null;
    },
    doValidation() {

      var isValid = true;
      this.errorMessage = null;
      isValid = this.globalValidation() && this.componentValidFunc();

      if (!isValid) {
        if (this.$refs.inputField) {
          if (this.$refs.inputField.constructor === Array) {
            this.$nextTick(() => this.$refs.inputField[0].focus())
          }
          else {
            this.$nextTick(() => this.$refs.inputField.focus())
          }
        }
      }
      // var validationObject = {
      //   id: this.schema.id,
      //   position: this.schema.position,
      //   isValid: isValid
      // };
      // this.updateValidation(validationObject);
      return isValid;
    }

  },
  watch: {
    selected: function (val) {
      const that = this;

      var updatedValue = val;
      if (val.constructor === Array) {
        updatedValue = JSON.stringify(val);
      }

      var updateObject = {
        id: that.schema.id,
        fieldDefinitionId: that.schema.id,
        position: that.schema.position,
        value: updatedValue
      };
      this.updateResults(updateObject);
    }
  }
};
