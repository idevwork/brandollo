<template>
  <div>
    <h3>Invite Your Team</h3>
    <add-team-modal ref="addMembers"/>
  </div>
</template>

<script>
import AddTeamMemberModal from "@/App/components/Shared/modals/AddTeamMemberModal.vue";

export default {
  name: "Invite-Team",
  components: {
    'add-team-modal': AddTeamMemberModal
  },
  props: ["fieldIndex", "pageIndex"],
  data() {
    return {
      active: true
    };
  },
  methods: {
    pageChange() {     
      this.$refs.addMembers.inviteEmails();
    },
    doValidation() {
      return this.$refs.addMembers.validationStatus();
    }
  }
};
</script>

<style scoped lang="scss">
</style>
