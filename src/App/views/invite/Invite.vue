<template>
  <spinner :ready="true">
    <div class="page" align="center">
      <div align="center">
        <h1
          id="invite__heading"
        >Get 2 additional months free platform access by inviting your friends to Brandollo!</h1>

        <span id="invite__text" >
          <i>Give your friends the gift of 4 months free access to Brandollo
            and when they join <br>you'll get 2 additional free months for your account.
          </i>
        </span>
        <span id="invite__text">
        <i><br>Invite your friends by email</i>
        </span>
      </div>
      <div class="row section_details">
        <div class="col">
          <div v-for="(invitee,i) in invites" :key="i">
            <div class="row">
              <div class="col">
                <input
                  class="name__input"
                  ref="firstName"
                  type="text"
                  :placeholder="i == 0 ? 'Name': 'One more?'"
                  v-model="invitee.firstName"
                >
              </div>

              <div class="col">
                <input
                  type="email"
                  class="email__input"
                  placeholder="Email"
                  @focus="addMore(i)"
                  v-model="invitee.email"
                  :onchange="validateEmail(invitee.email, i)"
                >
                <p
                  class="email__error"
                  v-if="emailErrorMessage[i] && invitee.email"
                >{{emailErrorMessage[i]}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row section_submit">
        <div class="col-12 text-center mt-3">
          <button class="round-button" @click="referral()">Invite</button>
        </div>
        <div class="col-12 text-center mt-5">
          <a href="#" @click="skip()">Skip</a>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <p v-if="errorMessage && !successMessage" transition="fade">{{ errorMessage }}</p>
          <p v-if="successMessage" transition="fade">{{ successMessage }}</p>
        </div>
      </div>
    </div>
  </spinner>
</template>

<script>
import { Spinner, } from "@/App/components";
import { referAFriend } from "@/Common/services/ReferService";
import { find } from "lodash";

export default {
  name: "referral",
  components: {
    spinner: Spinner
  },
  data() {
    return {
      errorMessage: null,
      successMessage: null,
      invites: [{ firstName: null, email: null }],
      emailErrorMessage: []
    };
  },
  mounted() {
    this.$refs.firstName[0].focus();
  },
  methods: {
    skip() {
      this.$router.push({
        path: "/plan/create"
      });
    },
    referral: function() {
      var index = find(this.emailErrorMessage, element => {
        return element != null;
      });
      if (!index) {
        referAFriend(this.invites).then(response => {
          if (response.success == true) {
            this.successMessage = response.message;
            this.$router.push({
              path: "/plan/create"
            });
          } else {
            this.errorMessage = response.message;
          }
        });
      }
    },
    addMore(i) {
      if (this.invites.length - 1 <= i) {
        this.invites.push({ firstName: null, email: null });
      }
    },
    validateEmail(email, index) {
      if (email) {
        var re = /\S+@\S+\.\S+/;
        if (!re.test(email)) {
          this.emailErrorMessage[index] = "Valid email required.";
        } else {
          this.emailErrorMessage[index] = null;
        }
      }
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.page {
  background-color: white;
  margin: auto;
  margin-top: 75px;
  max-width: 800px;
  padding: 50px;

  .name__input {
    text-align: right;
  }

  @media (max-width: 550px) {
    h1 {
      font-size: 28px;
    }

    .name__input {
      text-align: center;
    }
    .email__input {
      text-align: center;
    }
  }

  .section_details {
    margin: 20px;
  }

  .section_submit {
    margin-top: 20px;
  }

  input {
    border: none;
    border-color: transparent;
    font-size: 16px;
    padding: 10px;
  }

  input:focus {
    outline: 0;
    border: inset;
    border-width: 0 0 2px;
    border-color: #45a4ec;
  }

  .round-button {
    width: 100px;
    min-height: 30px;
    border-radius: 25px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border: none;
    color: white;
    background-color: #45a4ec;
  }

  .email__error {
    color: red;
    font-size: 10px;
    margin: 0;
    padding-left: 10px;
  }
}

#invite__heading {
  text-align: center;
}

#invite__text {
  color: grey;
  font-size: 13px;
  text-align: center;
}

</style>
