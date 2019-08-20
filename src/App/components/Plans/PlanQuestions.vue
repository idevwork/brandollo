<template>
  <spinner :ready="ready">
    <div class="card-box project-box">
      <form-wizard
        ref="formQuestions"
        :title="formSchema.name"
        subtitle
        color="#e91e63"
        shape="circle"
        step-size="xs"
      >
        <tab-content
          v-for="(page, pageIndex) in formPages"
          :key="pageIndex"
          :before-change="()=>pageChange(pageIndex)"          
          class="wizard-height"
        >
          <div
            class="custom-group"
            v-for="(fieldSchema, fieldIndex) in page.page"
            :key="fieldIndex"
          >
            <component
              ref="formField"
              v-bind:key="fieldIndex"
              v-bind:is="fieldSchema.fieldType =='custom' ? getFieldOptions(fieldSchema.options).component : fieldSchema.fieldType"
              :pageIndex="pageIndex"
              :fieldIndex="fieldIndex"
            >
              <!-- component changes when vm.currentView changes! -->
            </component>
          </div>
        </tab-content>

        <template slot="footer" slot-scope="props">
          <div class="wizard-footer-left">
            <wizard-button
              v-if="props.activeTabIndex > 0 "
              @click.native="props.prevTab()"
              class="box-button mr-1"
              :style="props.fillButtonStyle"
            >&#60;</wizard-button>
            <wizard-button
              v-if="!props.isLastStep"
              @click.native="props.nextTab()"
              class="wizard-footer-right"
              :style="props.fillButtonStyle"
            >Next</wizard-button>

            <wizard-button
              v-else
              :disabled="disableSubmit"
              @click.native="submit"
              @keyup.enter.native="submit"
              class="wizard-footer-right finish-button"
              :style="props.fillButtonStyle"
            >Done</wizard-button>
          </div>
        </template>
      </form-wizard>
    </div>
  </spinner>
</template>

<script>
import Vue from "vue";
import { mapActions, mapGetters, mapState } from "vuex";
import { FormWizard, TabContent, WizardButton } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import { forEach, map, filter, every } from "lodash";

import Spinner  from "@/App/components/Spinner";
import {
  BooleanField,
  DropdownField,
  EmailText,
  LongText,
  MultipleChoice,
  ScaleField,
  Title,
  Number,
  Date
} from "@/App/components/FormBuilder";

import InviteTeam from "@/App/components/Plans/InviteTeam";
import ActionPicker from "@/App/components/Plans/ActionPicker";
import ActionOrder from "@/App/components/Plans/ActionOrder";

export default {
  name: "Plan-Questions",
  components: {
    spinner: Spinner,
    FormWizard,
    TabContent,
    titlelabel: Title,
    multiple: MultipleChoice,
    bool: BooleanField,
    longtext: LongText,
    textfield: LongText,
    email: EmailText,
    dropdown: DropdownField,
    scale: ScaleField,
    wizardButton: WizardButton,
    number: Number,
    date: Date,
    actionOrder: ActionOrder,
    actionPicker: ActionPicker,
    inviteTeam: InviteTeam
  },
  props: {
    formId: Number
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      teamId: s => s.teamStore.currentTeamId,
      ready: s => s.question.ready,
      formSchema: s => s.question.formSchema,
      formPages: s => s.question.formPages,
      disableSubmit: s => s.question.disableSubmit,
      isValid: s => s.question.isValid
    }),
    ...mapGetters({
      checkLimit: s => s.question.checkUseLimit
    })
  },
  mounted() {
    this.loadStore(this.formId);

    window.addEventListener("keypress", this.triggerPageChange);
  },
  destroyed: function() {
    window.removeEventListener("keypress", this.triggerPageChange);
  },
  watch: {
    formId() {
      this.loadStore(this.formId);
    }
  },
  methods: {
    ...mapActions("question", [
      "loadStore",
      //"updateResults",
      //"updateValidation",
      //"allowPageChange",
      "pushToServer"
      //"touchPage"
    ]),
    getFieldOptions(fieldOptions) {
      let options = JSON.parse(fieldOptions);
      return options;
    },
    triggerPageChange: function(e) {
      if (e.keyCode == 13) {
        if(this.$refs.formQuestions) {
          this.$refs.formQuestions.nextTab();
        }
      }
    },
    pageChange: function(prev) {
      let that = this;
      return new Promise(resolve => {
        let current = filter(that.$refs.formField, f => f.pageIndex == prev);

        forEach(current, f => {
          if (!f.doValidation()) {
            resolve(false);
          }
        });

        forEach(current, f => {
          if (f.pageChange) {
            f.pageChange();
          }
        });

        resolve(true);
        window.scrollTo(0, 0);
      });
    },

    submit: function() {
      const that = this;

      (async () => {
        let isValid = await that.pageChange(that.formPages.length - 1);
        if (isValid) {

          that.$swal({
            title: "Preparing Plan..",
            html: "We are creating your plan. Hang on",
            type: "success",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false,
          });

          that.$swal.showLoading();

          await this.pushToServer(this.teamId);

          that.$swal.hideLoading();
          that.$swal.close();

          that.$emit("plan-created", {
            planId: that.formSchema.id
          });
        }
      })();  
    }
  }
};
</script>

<style scoped >
.box-button {
  min-width: 40px !important;
}

.custom-group >>> .section-title {
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 0;
}

.custom-group >>> .title {
  font-size: 20px;
  font-weight: 500;
  padding-top: 15px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 0;
}

.custom-group >>> .description {
  font-weight: normal;
  padding-top: 0;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 0;
}

.custom-group >>> .controls {
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 0;
}

/* error block  */
.custom-group >>> .help-block {
  padding-top: 0;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 0;
}

.custom-group >>> .check-box {
  margin-right: 0;
  margin-bottom: 10px;
}
</style>
