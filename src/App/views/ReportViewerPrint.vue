<template>
<div>
    <div class="loading" v-if="loading">
        Loading...
    </div>
    <div id="outerDiv" v-if="report">
        <div class="container">
            <div class="div-header">
                <div class="logo">
                    <img src="../assets/img/Brandollo-logo.png">
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <div v-for="(section, key) in report" :key="key" class="">
                        <div :class="['div-content']">
                            <div class="row">
                                <div class="col-xs-12">
                                    <h2>
                                        <strong>{{section.resource.title}}</strong>
                                    </h2>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-12">
                                    <span class="print-content" v-html="marked(section.resource.content ? section.resource.content : '')"></span>
                                </div>
                            </div>
                        </div>
                        <div class="page-break"></div>
                    </div>
                </div>
            </div>
            <div class="div-footer">
                Brandollo © Terms and Conditions apply
            </div>
        </div>
    </div>
    <div id="done" v-if="doneRender"></div>
</div>
</template>

<script>
import Vue from "vue";
import settings from "@/settings";
import marked from "marked";
import { getContent } from "@/Common/services/LearnService";
import {orderBy} from 'lodash'; 

export default {
  name: "report-viewer",
  components: {},
  props: ["id"],
  // mixins: [authMixin],
  data() {
    return {
      loading: true,
      doneRender: false,
      report: { }
    };
  },
  created: function() {
    const that = this;
    that.primeHeadlessToken();
  
    if(!this.$route.query.content){
      console.log('No resources specified. cant really do much')
      return;
    }
    getContent(this.$route.query.content).then(d => {
      let orderedD = orderBy(d,['position'],['asc']);
      that.report = orderedD;
      that.loading = false;
    });
  },
  updated: function() {
    let that = this;
    Vue.nextTick(function() {
      that.doneRender = true;
    });
  },
  methods: {
    marked: function(input) {
      return marked(input);
    }
  }
};
</script>

<style>
#outerDiv h2 {
  font-size: 45px;
  margin-top: 50px;
  margin-bottom: 50px;
}
#outerDiv p,
li {
  font-size: 20px;
  line-height: 1.6;
}
#outerDiv p {
  margin-bottom: 20px;
}

.logo {
  width: 20vh;
}
#outerDiv {
  background-color: white;
}

div.div-content {
  padding-top: 100px;
}

img[alt="drawing"] {
  max-width: 200px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
@media print {
  .page-break {
    page-break-before: always;
  }

  div.div-header {
    position: fixed;
    top: 20px;
  }
  div.div-footer {
    position: fixed;
    bottom: 20px;
  }
}
</style>
