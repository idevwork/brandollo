<template>
  <div>
    <div v-if="permission">
      <popper trigger="hover" :options="{placement: 'right'}">
        <!-- Assign popper content -->
        <div class="popper task-assign-container" trigger="click" :options="{placement: 'left'}">
          <input type="text" placeholder="Search for members">
          <div class="members">
            <div
              v-for="(member, index) in members"
              :key="index"
              :class="action && action.assignedUserId == member.userId? 'assigned' : ''"
            >
              <div @click.stop="assignMember(member.userId, action)" class="member">
                <avatar
                  style="margin:5px"
                  :name="getUser(member.userId)"
                  size="tiny"
                  :order="member.position"
                />
                <div
                  class="user-name"
                >{{member.userDetailsFirstName ? member.userDetailsFirstName : "No name"}}</div>
              </div>
            </div>
          </div>
          <input
            type="text"
            v-model="email"
            placeholder="Type member's email to invite"
            v-on:keyup.enter="onSubmit(email)"
            :onchange ="validateEmail(email)"
          >
          <p v-if="emailError == true" class="email__error">Please enter valid email.</p>
          <div v-if="true" class="addnew">
            <div class="invite-btn" @click="onSubmit(email)">Invite</div>
          </div>
        </div>

        <!-- Assign popper reference -->
        <div slot="reference" class="pointer row-flex">
          <!-- Assigned user avatar -->
          <avatar
            v-if="action && action.assignedUserId"
            style="margin:5px 5px 5px 5px; display: inline-block"
            :name="getUser(action.assignedUserId)"
            :order="memberPosition"
            size="tiny"
          />

          <!-- Assign user icon -->
          <div v-else class="d-flex d-sm-block">            

            <font-awesome-icon v-if="!detailsMode" style="font-size:20px" icon="user-circle"/>
            <div v-else class="d-flex align-items-center justify-content-center">
             <font-awesome-icon style="font-size:20px;padding-right:3px" icon="user-circle"/> Unassigned
            </div>
          </div>

          <!-- Assigned user info -->
          <div class="col-flex" v-if="action && action.assignedUserId && showAssignText">
            <span style="font-weight: bold; color: black">Assign</span>
            <span>{{getUser(action.assignedUserId)}}</span>
          </div>
        </div>
      </popper>
    </div>

    <div v-else>
      <avatar
        v-if="action && action.assignedUserId"
        style="margin:5px"
        :name="getUser(action.assignedUserId)"
        :order="memberPosition"
        size="tiny"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Popper from "vue-popperjs";
import Avatar from "@/App/components/Shared/Avatar";
import notificationMixin from "@/Common/mixins/Notification";

export default {
  components: {
    popper: Popper,
    avatar: Avatar
  },
  mixins: [notificationMixin],
  props: {
    "members": null,
    "action": {
      type: Object,
      default: () => {}
    },
    "permission": null,
    "showAssignText": null,
    "detailsMode": {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      email: "",
      emailError: false
    };
  },
  computed: {
    ...mapGetters({
      getUser: "getTeamMemberName",
      getTeamMember: "getTeamMember",
      currentTeamId: "currentTeamId"
    }),
    memberPosition() {
      if (this.action) {
        let member = this.getTeamMember(this.action.assignedUserId);
        return member ? member.position : 0;
      }

      return 0;
    }
  },
  methods: {
    ...mapActions({
      addTeamMember: "addTeamMember"
    }),
    assignMember: function(member, action) {
      this.$emit("assignMember", {
        member,
        action
      });
    },


    onSubmit(formData) {
      // form submit logic
      if (formData && this.emailError == false) {
        
        const payload = {
          userEmail: formData,
          teamId: this.currentTeamId,
          role: "admin"
        };
        console.log(payload);
        this.addTeamMember(payload)
          .then(res => {
            this.showToast(res.message);
            this.email = null;
          })
          .catch(err => {
            this.error = err.Error;
            this.showToast(err.message, "error");
          });
      }
      else {
        this.emailError = true;
      }
    },
    validateEmail(email) {
      if (email) {
        var re = /\S+@\S+\.\S+/;
        if (!re.test(email)) {
          this.emailError = true;
        } else {
          this.emailError = false;
        }
      }
    }

  }
};
</script>

<style lang="scss">
.row-flex {
  display: flex;
  flex-direction: row;
}

.col-flex {
  display: flex;
  flex-direction: column;
}

.task-assign-container {
  width: 240px !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 21474836000;
  background-color: white;
  padding: 0px !important;
  border: 0.5px solid #b3b3b3;
  box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.15);
  input[type="text"] {
    width: 100%;
    border: 0;
    outline: 0px;
    background: transparent;
    padding-left: 20px;
    height: 50px;
    font-family: Roboto;
    font-style: italic;
    font-weight: 300;
    line-height: 22px;
    font-size: 14px;
    color: #666666;
    border-bottom: 0.5px solid #dbdbdb;
  }
  .members {
    text-align: left;
    width: 100%;
    .member {
      display: inline-flex;
      height: 50px;
      align-items: center;
      border-bottom: 0.5px solid #dbdbdb;
      padding-left: 18px;
      width: 100%;
      .user-name {
        font-family: Roboto;
        font-style: normal;
        font-weight: 500;
        line-height: 22px;
        font-size: 14px;
        color: #666666;
      }
    }
    .assigned {
      background-color: #45ace1;
      .user-name {
        color: white;
      }
    }
  }
}

.addnew {
  text-align: right;
  margin-right: 10px;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 50px;
  align-items: center;
  justify-content: flex-end;
  padding-right: 14px;
  .invite-btn {
    width: 100px;
    height: 30px;
    border-radius: 24px;
    color: white;
    padding-top: 5px;
    text-align: center;
    cursor: pointer;
    background-color: #6d6d6d;
  }
}

.pointer {
  cursor: pointer;
}

.custom-plus-circle {
  font-size: 22px;
  vertical-align: middle;
}
.email__error {
    color: red;
    font-size: 10px;
    margin: 0;
    padding-left: 10px;
    text-align: left;
  }
</style>

<style lang="scss" scoped>
  .assign-user-icon {
    border-radius: 50%;
    border: 1px dashed #666;
    color: #666;
    padding: 5px;
    width: 25px;
    height: 25px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    & ~ span {
      margin-left: 10px;
      font-weight: bold;
      font-size: 16px;
    }
  }
</style>
