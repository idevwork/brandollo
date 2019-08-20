<template>
    <div class="page-pad">
        <div class="container">
            <div class="row">
                <!-- <div class="col-sm-6 half-way" style="padding:20px"> -->
                <div class="col-xs-12 top-pad" style="text-align:center">
                    <h1 style="font-size:41px; font-weight:400">
                      Sign up complete!
                    </h1>

                 

                    <div style="margin-top:0em;">

                    </div>
                    <div class="row">                    
                      <h3>Click <router-link title="Dashboard" to="/questions/1/"  >here </router-link> to sign in and get started. 
               </h3>
                    </div>

                </div>
                <!-- <div class="col-sm-6 hidden-xs" style="height:90vh; transform: translateY(30%);">
                    <img :src="laptop" alt="" height="26" class="logo-small" style="padding-left:10px">
                </div> -->
            </div>
        </div>
    </div>
</template>


<script>
import laptop from "../../assets/img/product/Laptop.png";



export default {
  name: "Enquire",
  metaInfo: {
    title: "Signup complete"
  },

  data() {
    return {
    
    };
  },


};
</script>

<style lang="scss" scoped>
.account-details {
  background-color: transparent;
  border: none;
  display: block;
  font-family: sans-serif;
  margin: 0;
  padding: 0;
  width: 100%;
  font-size: 1em;
  line-height: 1.2em;
  height: 2.2em;
  font-size: 24px;
  color: "#555";
  padding: 10px 10px 10px 0;

  &::placeholder {
    font-size: 18px;
    color: "#55555582";
    opacity: 1;
    font-style: italic;
  }

  &::-ms-input-placeholder {
    color: "#55555582";
    opacity: 1;
    font-style: italic;
  }
}

.page-pad {
  margin-top: 70px;
  background-color: white;
}

.full-height {
  height: 100%;
}

.half-way {
  top: 25%;
}

@media (min-width: 768px) {
  .top-pad {
    margin-top: 10em;
    height: 100vh;
  }
}

.error {
  background-color: transparent;
  border: none;
  display: block;
  width: 100%;
  font-size: 18px;
  color: #e91e63;
}
</style>

