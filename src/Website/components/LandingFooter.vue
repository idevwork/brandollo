<template>
  <div>
    <section
      class="contactus section-image"
      id="contact"
      data-sorder="hestia_contact"
      style="background-image: url('')"
    >
      <div class="container">
        <div class="row">
          <div class="col-md-8 col-md-offset-2 col-xs-12">
            <div class="row">
              <div class="col-xs-12 col-md-4">
                <div class="hestia-description">
                  <div class="hestia-info info info-horizontal">
                    <div class="icon icon-primary"></div>
                    <div class="description">
                      <h4 class="info-title">
                        <font-awesome-icon icon="comment"/> Social
                      </h4>
                      <p>
                        <a href="https://twitter.com/brandollodotcom" target="_blank">Twitter</a>
                      </p>
                      <p>
                        <a href="https://au.linkedin.com/company/brandollo" target="_blank">Linkedin</a>
                      </p>
                      <p>
                        <a href="https://www.facebook.com/brandollo" target="_blank">Facebook</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-md-4">
                <div class="hestia-description">
                  <div class="hestia-info info info-horizontal">
                    <div class="description">
                      <h4 class="info-title">
                        <font-awesome-icon icon="envelope"/> Contact us
                      </h4>
                      <p>
                        <a href="mailto:hello@brandollo.com">Email</a>
                      </p>
                      <p>
                        <a href="tel:+61451750005">Phone</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-md-4">
                <div class="hestia-description">
                  <div class="hestia-info info info-horizontal">
                    <div class="description">
                      <h4 class="info-title">
                        <font-awesome-icon icon="user-secret"/> Links
                      </h4>
                      <p>
                        <router-link
                          title="Terms and conditions"
                          to="/terms-and-conditions"
                        >Terms & Conditions</router-link>
                      </p>
                      <p>
                        <router-link title="Privacy policy" to="/privacy-policy">Privacy Policy</router-link>
                      </p>
                      <p>
                        <router-link title="Brandollo for startups" to="/for-startup">For Startups</router-link>
                      </p>
                      <p>
                        <router-link
                          title="Brandollo for small business"
                          to="/for-small-business"
                        >For Small Business</router-link>
                      </p>
                      <p>
                        <router-link
                          title="Brandollo for Marketing Agencies"
                          to="/for-marketing-agency"
                        >For Marketing Agencies</router-link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer class="footer">
      <div class="row">
        <div class="col-xs-12 center">
          <div class="copyright">
            2019 | Powered by
            <a href="http://brandollo.com" rel="nofollow">Brandollo Ltd</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.contactus,
footer {
  background: #263a3d;
}

.contactus {
  padding-bottom: 60px;
  padding-top: 60px;
}

.info-title {
  font-family: "Montserrat", sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: normal;
  text-transform: uppercase;
  color: #83edfc;
}

.description a {
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: normal;
  letter-spacing: 0.08em;
  color: #ffffff;
  text-decoration: none;
}

.copyright {
  text-align: center;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: normal;
  letter-spacing: 0.05em;
  color: #ffffff;
  margin-bottom: 50px;
}

.copyright a {
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: normal;
  letter-spacing: 0.05em;
  color: #ffffff;
  text-decoration: none;
}

@media (max-width: 1400px) {
  .copyright {
    margin-top: -40px;
  }
}

@media (max-width: 991px) {
  .contactus {
    padding-left: 40px;
  }
  .copyright {
    right: 40px;
  }
}
</style>
