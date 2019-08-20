<template>
  <spinner :ready="ready">
    <div class="settings-container">
      <div class="section">
        <div class="row">
          <div class="col">
            <h2>Notifications</h2>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <h4>Use the Url below to add your custom plans into your favourite calendar</h4>
          </div>
        </div>

        <div class="row">
          <div class="col-10">
            <div class="input-group">
              <input
                type="text"
                ref="calUrl"
                class="form-control"
                style="height:40px"
                v-model="calendarUrl"
                readonly
              >
              <div class="input-group-append">
                <button class="btn btn-light" type="button" @click="copyToClipboard()">Copy</button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4>How often do you want to receive updates?</h4>

          <div class="pretty p-icon p-jelly col-12">
            <input
              type="checkbox"
              v-model="daily"
              @change="save('actionnotification-email-daily-enabled',daily)"
            >
            <div class="state p-primary">
              <font-awesome-icon  class="icon" icon="check"/>              
              <label>Receive by email your daily recommended action, based on your plan</label>
            </div>
          </div>
          <div class="pretty p-icon p-jelly col-12">
            <input
              type="checkbox"
              v-model="weekly"
              @change="save('actionnotification-email-enabled', weekly)"
            >
            <div class="state p-primary">
              <font-awesome-icon  class="icon" icon="check"/>
              <label>Receive a weekly summary of your actions.</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </spinner>
</template>

<script>
import Spinner  from "@/App/components/Spinner";
import {
  getCalendarUrl,
  updateNotificationSettings,
  getNotificationsSettings
} from "@/Common/services/NotificationService";

import notificationMixin from "@/Common/mixins/Notification";
import { mapActions, mapGetters, mapState } from "vuex";

const CurrentTeam = "CurrentTeamId";

export default {
  name: "Notification-Settings",
  mixins: [notificationMixin],
  data() {
    return {
      ready: false,
      calendarUrl: null,
      daily: false,
      weekly: false,
      settingsName: []
    };
  },
  computed: {
    ...mapState({
      teamStoreReady: state => state.teamStore.teamStoreReady,
      team: state => state.teamStore.currentTeam,
      userId: state => state.userStore.user.profile.sub
    })
  },
  components: {
    spinner: Spinner
  },
  mounted() {
    if (this.team) {
      this.load();
    }
  },
  watch: {
    teamStoreReady() {
      this.load();
    }
  },
  methods: {
    ...mapActions({
      updateCurrentTeam: "updateTeam",
      addTeamMember: "addTeamMember",
      removeTeamMember: "removeTeamMember",
      updateMemberRole: "updateMemberRole"
    }),
    load() {
      getCalendarUrl({ teamId: this.team.id }).then(d => {
        this.calendarUrl = d;
        getNotificationsSettings({ userId: this.userId }).then(response => {
          this.settingsName = response;
          if (this.settingsName["actionnotification-email-enabled"] == null) {
            this.weekly = true;
          } else {
            if (
              this.settingsName["actionnotification-email-enabled"].value ==
              "true"
            ) {
              this.weekly = true;
            } else {
              this.weekly = false;
            }
          }
          if (
            this.settingsName["actionnotification-email-daily-enabled"] == null
          ) {
            this.daily = true;
          } else {
            if (
              this.settingsName["actionnotification-email-daily-enabled"]
                .value == "true"
            ) {
              this.daily = true;
            } else {
              this.daily = false;
            }
          }
          this.ready = true;
        });
      });
    },
    copyToClipboard() {
      this.$refs.calUrl.select();
      document.execCommand("copy");
    },
    save(settingName, settingValue) {
      let payload = {
        SettingName: settingName,
        Value: settingValue
      };
      updateNotificationSettings({ userId: this.userId }, payload)
        .then(response => {
          this.showToast("Your preference has been updated", response);
        })
        .catch(err => {
          this.showToast("Something went wrong please try again", "error");
        });
    }
  }
};
</script>


<style lang="scss">
@import "~pretty-checkbox/src/pretty-checkbox.scss";
</style>

<style lang="scss" scoped>
.settings-container {
  margin-top: 50px;
  padding: 10px 30px;
  display: flex;
  flex-direction: column;

  .section {
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 20px;
    margin-bottom: 25px;
  }

  .pretty {
    margin-bottom: 10px;
  }
}
</style>
