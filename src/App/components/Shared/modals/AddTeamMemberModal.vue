<template>
  <div v-if="teamReady">
    <div v-if="availableTeamSize > 0">
      <div class="row">
        <div class="col">
          <h4> Your team currently has {{currentTeam.teamSize}} members. <br>
            You can invite up to  {{availableTeamSize}} more by adding their emails below</h4>        
        </div>
      </div>
     
      <div v-for="(a,i) in availableTeamSize" :key="a" class="row">
        <div class="col-6 controls">
          <input
            type="email"
            name="team email"
            class="form-control"
            placeholder="Email"
            v-model.trim="email[i].value"
            @change="$v.email.$each[i].value.$touch()"
          >
          <span v-if="!$v.email.$each[i].value.email" class="text-danger">Please provide a valid email</span>
        </div>
      </div>
  
      <div class="row">
        <div class="col">{{error}}</div>
      </div>
    </div>
    <div v-else>
      <h4>Your team is full</h4>
    </div>

    <div class="row">
      <div class="col mt-5">
        <span>More than {{currentTeam.maxTeamSize}} members? Please contact us.</span>
      </div>
    </div>

    <div v-if="showAdd && availableTeamSize > 0" class="row">
      <div class="col">
        <b-btn variant="primary" :disabled="$v.email.$invalid" @click="inviteEmails(email)">Add</b-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { mapActions, mapGetters, mapState } from "vuex";

import { Avatar } from "@/App/components/Shared";
import notificationMixin from "@/Common/mixins/Notification";

export default {
  mixins: [validationMixin, notificationMixin],
  props: ["showAdd"],
  data() {
    return {
      email: [{ value: null }],
      error: null
    };
  },
  components: {
    avatar: Avatar
  },
  computed: {
    ...mapState({
      teamReady: s => s.teamStore.teamStoreReady
    }),
    ...mapGetters({
      currentTeam: "currentTeam",
      currentTeamId: "currentTeamId"
    }),
    availableTeamSize() {
      let slots = this.currentTeam.maxTeamSize - this.currentTeam.teamSize;
      this.email = [];
      for (let i = 0; i < slots; i++) {
        this.email.push({ value: null });
      }
      return slots;
    }
  },
  validations: {
    email: {
      $each: {
        value: {
          email
        }
      }
    }
  },
  methods: {
    ...mapActions({
      addTeamMember: "addTeamMember"
    }),
    inviteEmails() {     
      this.email.forEach(e => {
        if (e.value) {
          const payload = {
            userEmail: e.value,
            teamId: this.currentTeamId,
            role: "admin"
          };
          this.addTeamMember(payload)
            .then(res => {
              this.showToast(res.message);
            })
            .catch(err => {
              this.error = err.Error;
              this.showToast(err.message, "error");
            });
        }
      });
    },
    validationStatus() {
      return !this.$v.email.$invalid;
    },
    onHidden() {
      this.email = [];
      /** Trick to reset/clear native browser form validation state */
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
        this.$v.$reset();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.modal_members_list {
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
