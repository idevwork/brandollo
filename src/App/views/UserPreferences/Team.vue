<template>
  <spinner :ready="teamStoreReady" class="team-container">
    <!-- Page-Title -->
    <div class="row" v-if="team">
      <div class="col-sm-12">
        <div class="page-title-box">
          <h4 class="page-title">{{team.name}}</h4>
        </div>
      </div>
    </div>
    <!-- end page title end breadcrumb -->
    <!-- Team Wrapper Starts -->
    <div class="team-wrapper" v-if="team">
      <!-- Team Details Starts -->
      <div class="team-details">
        <p class="bold">TEAM SETTINGS</p>
        <p class="gray size-13">You can change team settings here</p>
        <div class="form">
          <div>
            <label>Name</label>
            <input class="form-control" type="text" v-model="team.name" />
          </div>
          <div>
            <label>Description</label>
            <input class="form-control" type="text" v-model="team.description" />
          </div>
        </div>
        <button
          class="btn btn-outline-danger waves-light waves-effect"
          @click="updateTeam"
          :disabled="saveStatus != 'save'"
        >{{ saveStatus }}</button>
      </div>

      <div class="team-details">
        <p class="bold">TEAM SUBSCRIPTION</p>
        <p class="gray size-13">Your current subscription details</p>
        <div class="form">
          <div v-for="(sub,i) in subscriptions" :key="i">
            <label>
              <b>{{sub.name}}</b>
            </label>
            <label>
              <span v-if="sub.expiry">Expires/Renews on</span>
              {{sub.expiry | formattedDate }}
            </label>
          </div>
          <div>
            <span>If you would like to cancel this subscription or increase your team size, contact us using the chat, in the bottom right</span>
          </div>
        </div>
      </div>

      <div class="team-members">
        <p class="bold">TEAM MEMBERS</p>
        <p class="gray size-13">Add or remove members of your team here</p>
        <div class="members">
          <div v-for="(member, index) in team.members" :key="index" class="member">
            <div class="avatar"></div>
            <div class="info">
              <div
                class="name"
              >{{member.userDetailsFirstName ? member.userDetailsFirstName : 'First Name'}}</div>
              <div class="email size-13 gray">{{member.userEmail}}</div>
            </div>
            <div class="role" v-if="member.role == 'owner'">{{member.role}}</div>
            <div class="input-group mb-3 role" v-else>
              <div class="input-group-prepend">
                <!-- <button
                  class="btn btn-custom waves-effect waves-light dropdown-toggle"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  :disabled="canChangeRole"
                >{{member.role}}</button>
                <div class="dropdown-menu">
                  <a class="dropdown-item" @click="updateRole(member, member.role, $event)">admin</a>
                  <a class="dropdown-item" @click="updateRole(member, member.role, $event)">super</a>
                  <a class="dropdown-item" @click="updateRole(member, member.role, $event)">member</a>
                </div> -->

                <!-- TESTER 2 -->
                <b-dropdown
                  style="background-color: #45ACE1 !important"
                  toggle-class="text-decoration-none btn btn-custom waves-effect waves-light"
                  variant="link"
                  :disabled="!canChangeRole"
                >
                  <template slot="button-content">{{member.role}}</template>
                  <b-dropdown-item
                    class="dropdown-item"
                    @click="updateRole(member, member.role, $event)"
                  >admin</b-dropdown-item>
                  <b-dropdown-item
                    class="dropdown-item"
                    @click="updateRole(member, member.role, $event)"
                  >super</b-dropdown-item>
                  <b-dropdown-item
                    class="dropdown-item"
                    @click="updateRole(member, member.role, $event)"
                  >member</b-dropdown-item>
                </b-dropdown>
              </div>
            </div>
            <div
              :class="!(member.role != 'owner') ? 'hide-btn' : ''"
              class="action"
              @click="showRemoveMemberDialog(member)"
            >x</div>
          </div>
        </div>
        <div class="addnew" @click="showAddMemberDialog">
          <span>+</span>&nbsp;&nbsp;
          <span>Add</span>
        </div>
      </div>
      <!-- Team Members Ends -->
    </div>
    <!-- Team Wrapper Ends -->
  </spinner>
</template>

<script>
import Spinner from "@/App/components/Spinner";
import notificationMixin from "@/Common/mixins/Notification";
import { mapActions, mapGetters, mapState } from "vuex";

const CurrentTeam = "CurrentTeamId";

export default {
  name: "manage-team",
  mixins: [notificationMixin],
  data() {
    return {
      saveStatus: "save",
      canChangeTeam: null
    };
  },
  computed: {
    ...mapState({
      teamStoreReady: state => state.teamStore.teamStoreReady,
      team: state => state.teamStore.currentTeam,
      subscriptions: s => s.teamStore.currentTeam.subscriptions
    }),
    ...mapGetters({
      userId: "userId"
    }),

    canChangeRole: function() {
      if (!this.userId || !this.team) return false;

      // getting member by id of logged in user
      var member = this.team.members.find(m  => m.userId == this.userId);

      // checking role
      if (member.role == "admin" || member.role == "owner") return true;

      return false;
    }
  },
  components: {
    spinner: Spinner
  },
  methods: {
    ...mapActions({
      updateCurrentTeam: "updateTeam",
      addTeamMember: "addTeamMember",
      removeTeamMember: "removeTeamMember",
      updateMemberRole: "updateMemberRole"
    }),
    // update team
    updateTeam: function() {
      var that = this;
      this.saveStatus = "saving..";

      const payload = {
        id: this.team.id,
        name: this.team.name,
        description: this.team.description
      };

      this.updateCurrentTeam(payload).then(res => {
        // setting save status
        this.saveStatus = "saved";
        setTimeout(() => {
          this.saveStatus = "save";
        }, 1000);
      });
    },
    // show add member dialog
    showAddMemberDialog: function() {
      this.$swal.close(); // closing previous alerts to avoid conflict

      this.$swal({
        title: "Invite new team member",
        input: "email",
        inputPlaceholder: "Enter email address",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        showCloseButton: true,
        confirmButtonText: "Send Invitation"
      }).then(data => {
        if (!data.dismiss) this.addMember(data.value);
      });
    },
    // show remove member dialog
    showRemoveMemberDialog: function(member) {
      this.$swal.close(); // closing previous alerts to avoid conflict

      this.$swal({
        html: `
            <div class="dialog-wrap" align="center">
              <div style="height: 80px; width: 80px; background-color: rgb(231, 231, 231); border-radius: 100px;"></div>
              <h3><b>Are you sure you want to remove ${member.userDetailsFirstName}</b></h3>
              <p>He won't like it</p>
            </div>
          `,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Sure",
        cancelButtonText: "Cancel"
      }).then(data => {
        if (!data.dismiss) this.removeMember(member);
      });
    },
    // add member to team
    addMember: function(email) {
      const payload = {
        UserEmail: email,
        teamId: this.team.id,
        role: "member"
      };

      this.addTeamMember(payload)
        .then(res => {
          this.showToast(res.message);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // remove member from team
    removeMember: function(member) {
      const payload = {
        userEmail: member.userEmail,
        teamId: this.team.id,
        role: "member"
      };

      this.removeTeamMember(payload)
        .then(res => {
          this.showToast("Member removed from team!");
        })
        .catch(err => {
          console.log(err);
        });
    },
    // update member role
    updateRole: function(member, role, evt) {
      var newRole = evt.target.innerHTML;
      if (role == newRole) return;

      const payload = {
        userEmail: member.userEmail,
        teamId: this.team.id,
        role: newRole
      };

      this.updateMemberRole(payload)
        .then(res => {
          this.showToast("Member role updated!");
          member.role = newRole;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
.team-container {
  padding: 10px 30px;
}
.team-wrapper {
  display: flex;
  flex-direction: column;
}
.team-wrapper .team-details,
.team-wrapper .team-members {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
  margin-bottom: 25px;
}
.team-wrapper .team-details > p,
.team-wrapper .team-members > p {
  margin-bottom: 0px;
}
.team-wrapper .team-details > .form {
  margin: 30px 0;
}
.team-wrapper .team-details > .form > div {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
.team-wrapper .team-details > .form label {
  font-size: 13px;
  font-weight: normal;
}
.team-wrapper .team-details > .form input {
  width: 250px;
}
.team-wrapper .team-details .btn {
  width: fit-content;
  margin-top: 30px;
}
.team-wrapper .members {
  display: flex;
  flex-direction: column;
  margin: 30px 0 10px;
  padding: 10px;
}
.team-wrapper .members .member {
  display: flex;
  flex-direction: row;
  width: 50%;
  padding: 10px 0px;
  border-bottom: 1px solid rgb(202, 202, 202);
}
.team-wrapper .members .member .avatar {
  height: 40px;
  width: 40px;
  background-color: rgb(231, 231, 231);
  border-radius: 100px;
}
.team-wrapper .members .member .info {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}
.team-wrapper .members .member .role {
  margin-left: auto;
  align-self: center;
  margin-bottom: 0 !important;
  width: fit-content !important;
  min-width: 0px;
}
.team-wrapper .members .member .action {
  margin: 0 10px;
  align-self: center;
  cursor: pointer;
  font-weight: bold;
}
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .team-wrapper .members .member {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
  }
  .team-wrapper .members .member .info {
    margin-right: 20px;
  }
  .team-wrapper .members .member .role {
    margin-left: 0;
    margin-top: 5px;
    align-self: center;
  }
  .team-wrapper .members .member .action {
    margin: 5px 10px 0;
    align-self: center;
    cursor: pointer;
    margin-left: auto;
  }
}
.gray {
  color: rgb(168, 168, 168);
}
.bold {
  font-weight: bold;
}
.size-13 {
  font-size: 13px;
}
.addnew {
  cursor: pointer;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.addnew span:nth-child(1) {
  font-size: 50px;
}
.hide-btn {
  visibility: hidden;
}
.dropdown-menu a {
  cursor: pointer;
}
</style>
