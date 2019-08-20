<template>
  <div>
    <!-- Page-Title -->
    <div class="row" style="margin: 20px 35px 0 35px">
      <div class="col-sm-12">
        <div class="page-title-box">

          <h4 class="page-title">Create your plan</h4>
        </div>
      </div>
    </div>
    <plan-questions :formId="id" v-on:plan-created="planCreated" class="form-questions"/>
  </div>
</template>

<script>
import Vue from "vue";

import schemaService from "@/Common/services/SchemaService";
import PlanQuestions from "@/App/components/Plans/PlanQuestions.vue";
import { mapActions } from "vuex";

export default {
  name: "form-viewer",
  metaInfo: {
    title: "Answer questions"
  },
  components: {
    "plan-questions": PlanQuestions
  },
  props: ["id", "team"],
  data() {
    return {
      ready: false
    };
  },
  mounted: function() {
    this.checkForm();
     this.ready = true; 
  },

  methods: {
        ...mapActions({
      initAction: "initAction",
      refreshAction : "refreshActionStore"
    }),
    checkForm: function() {
      const that = this;
      if (that.id == 1) {
        schemaService
          .checkHasFormData({ teamId: that.team, formId: 1 })
          .then(r => {
           
            if (r) {
              that
                .$swal({
                  title: "You already completed the introduction",
                  text:
                    "Create more plans by clicking the sidebar in the timeline.",
                  confirmButtonText: "Take me there",
                  type: "warning",
                  confirmButtonClass: "btn btn-confirm mt-2"
                })
                .then(() => {
                  that.$router.push({
                    path: "/actions-list?sidebar=true",
                    params: { hideMenu: false }
                  });
                });
            }
          });
      }
    },
    planCreated(plan) {
      let that = this; 
      if (plan.planId === 1) {
        that.ready = true;
        that
          .$swal({
            title: "All done!",
            html: "Time to create your first plan!",
            confirmButtonText: "Take me there",
            showCancelButton: false,
            cancelButtonText: "Download",
            allowOutsideClick: false,
            type: "success",
            confirmButtonClass: "btn btn-confirm mt-2",
            cancelButtonClass: "btn btn-confirm mt-2"
          })
          .then(result => {
            that.$router.push({
              path: "/plan/create"
            });
          });
      } else {
        that.ready = true;
        that
          .$swal({
            title: "All done!",
            html:
              "Your plan is ready. View your activities",
            confirmButtonText: "Next",
            type: "success",
            confirmButtonClass: "btn btn-confirm mt-2"
          })
          .then(() => {
            this.refreshAction(); 
            that.$router.push({
              path: "/actions-list"
            });
          });
      }
    }
  }
};
</script>

<style scoped>
.form-questions{
  margin: 0 50px 0 50px; 
}
</style>

