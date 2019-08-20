import settings from "@/settings";

{/*
    EXAMPLE FORM 

    
    <form v-if="!successMessage" @submit.prevent="subscribe($event)" class="textwidget">
              <div class="col">
                <div class="input-group">
                  <div class="form-group is-empty">
                    <input
                      v-model="email"
                      type="email"
                      class="sib-email-area form-control"
                      name="email"
                      required="required"
                      placeholder="Your work Email"
                    >
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col" style="padding: 0 10px 0 10px">
                  <p>
                    <input
                      type="submit"
                      class="btn btn-primary btn-block sib-default-btn"
                      name="submit"
                      value="View Demo"
                    >
                  </p>
                </div>
              </div>
            </form>
          </div>
          <div class="row">
            <div class="col-xs-12">
              <p v-if="errorMessage && !successMessage" transition="fade">{{ errorMessage }}</p>
              <p v-if="successMessage" transition="fade">{{ successMessage }}</p>
            </div>
          </div> */}

export default {

    data() {
        return {
            email: null,
            errorMessage: null,
            successMessage: null,
            subscribed:false
        };
    },
    methods: {      
        subscribe: function(list= 'preview') {
            let that = this;
      
            const payload = {
              source: list, 
              email: that.email
            };
      
            const resourceUrl = settings.accountApi + "mailinglist/subscribe";
      
            that.$http
              .post(resourceUrl, payload)
              .then(response => {
                console.log(response.data);
                if (response.data.success) {
                  that.successMessage = response.data.message;
                  that.subscribed = true;
                } else {
                  that.errorMessage = response.data.message;
                  if (
                    that.errorMessage == "You are subscribed already" ||
                    that.errorMessage == "All done"
                  ) {
                    that.subscribed = true;
                  }
                }
              })
              .catch(error => {
                console.log(error);
              });
          }
    }
    
};
