<template>
  <div class="action-picker">
    <div class="row">
      <div class="col">
        <h1>Select Marketing Activities</h1>
        <h5>Choose the marketing activities you want to include in your plan</h5>
      </div>
    </div>
    <div class="row main-section">
      <div v-for="catType in groupedResource" :key="catType.type" class="row">
        <!-- <h1>{{catType.columnName}}</h1> -->
        <div class="checkbox-group col-12 col-sm-4" v-for="(cat,catName) in catType.c" :key="catName">
          <h3>{{catName}}</h3>

          <div class="check-box-container" v-for="resource in cat" :key="resource.id">
            <div :class="prettyClasses">
              <input ref="inputField" type="checkbox" :value="resource.id" v-model="selected">
              <div class="state p-primary">
                <font-awesome-icon icon="check" class="icon"/>
                <label>{{resource.title}}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import planService from "@/Common/services/PlanService";
import { groupBy, map, orderBy} from "lodash";

export default {
  name: "Action-picker",
  props: ["fieldIndex", "pageIndex"],
  data() {
    return {
      active: true,
      resources: null,
      selected: []
    };
  },
  mounted() {
    planService.getCustomPlanActions().then(r => (this.resources = r));
  },
  computed: {
    ...mapGetters("question", ["getTouchStatus", "getSchema"]),
    schema() {
      return this.getSchema(this.pageIndex, this.fieldIndex);
    },
    groupedResource() {
      let orderedResources = orderBy(this.resources, r => r.title);
      let ff = groupBy(orderedResources, r => r.category.categoryTypeName);
      let gg = map(ff, (value, type) => {
        let columnName = type.replace("Custom-", "");
        let o = orderBy(value, o => o.category.name);
        let c = groupBy(o, r => r.category.name);
        
        return { columnName, c };
      });
      return gg;
    },
    prettyClasses: function() {
      return {
        pretty: true,
        "p-icon": true,
        "p-round": false,
        "p-jelly": true,
        //other styles
        "check-box": true,
        "col-xs-12": true,
        "col-sm-12": true
      };
    }
  },
  methods: {
    doValidation() {
      return this.selected.length > 0;
    },
    ...mapActions("question", ["updateResults", "updateCustomActions"])
  },
  watch: {
    selected: function(val) {
      const that = this;

      var updatedValue = val;
      if (val.constructor === Array) {
        updatedValue = JSON.stringify(val);
      }

      var updateObject = {
        id: that.schema.id,
        fieldDefinitionId: that.schema.id,
        position: that.schema.position,
        value: updatedValue
      };
      this.updateResults(updateObject);
      this.updateCustomActions(val);
    }
  }
};
</script>

<style lang="scss">
@import "~pretty-checkbox/src/pretty-checkbox.scss";

.action-picker {

  .main-section{
    padding: 0 15px 0 15px; 
  }
  .checkbox-group {
    padding: 0;
    margin-top: 30px;

    .check-box-container {
      height: 30px;
      .check-box {
        margin: 8px;
      }
    }
  }
}
</style>
