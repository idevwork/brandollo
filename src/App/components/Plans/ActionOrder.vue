<template>
  <div class="action-order">
    <h1>Choose Your Preferred Order Of Activities</h1>
    <h5>Drag and drop actions to match the preferred order of completion (you can change this later if required)</h5>
    <draggable v-model="orderedResources" @start="drag=true" @end="drag=false">
      <div v-for="r in orderedResources" :key="r.id" class="row">
        <div class="col-12 draggable">          
          <font-awesome-icon style="color: black;" icon="bars"/>
          <span class="title">{{r.title}}</span>
          <span class="category-name">{{r.category.name}}</span>
          <!-- <span class="category-type">({{r.category.categoryTypeName.replace('Custom-','')}})</span> -->
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { filter, map, forEach, find } from "lodash";
import draggable from "vuedraggable";
import planService from "@/Common/services/PlanService";

export default {
  name: "Action-order",
  props: ["fieldIndex", "pageIndex"],
  components: {
    draggable
  },
  data() {
    return {
      selected: [],
      resources: null
    };
  },
  mounted() {
    planService.getCustomPlanActions().then(r => (this.resources = r));
  },
  computed: {
    ...mapState({
      pickedResources: s => s.question.customSelectedActions
    }),
    ...mapGetters("question", ["getTouchStatus", "getSchema"]),
    schema() {
      return this.getSchema(this.pageIndex, this.fieldIndex);
    },
    orderedResources: {
      get() {
        let orderedList = [];
        forEach(this.pickedResources, o => {
          orderedList.push(
            find(this.resources, r => {
              return o == r.id;
            })
          );
        });
        return orderedList;
      },
      set(value) {
        let ids = map(value, "id");
        this.updateCustomActions(ids);
        var updateObject = {
          id: this.schema.id,
          fieldDefinitionId: this.schema.id,
          position: this.schema.position,
          value: JSON.stringify(ids)
        };
        this.updateResults(updateObject);
      }
    }
  },
  methods: {
    ...mapActions("question", ["updateResults", "updateCustomActions"]),
    doValidation() {
      return true;
    },
    pageChange() {
      let ids = map(this.orderedResources, "id");
      this.updateCustomActions(ids);
      var updateObject = {
        id: this.schema.id,
        fieldDefinitionId: this.schema.id,
        position: this.schema.position,
        value: JSON.stringify(ids)
      };
      this.updateResults(updateObject);
    }
  }
};
</script>

<style scoped lang="scss">
.action-order {
  .title {
    font-size: 20px;
  }

  .category-type {
    font-weight: 600;
  }

  .category-name {
    font-weight: 600;
  }
  .draggable {
    padding: 10px;
    margin: 10px;
  }
  .sortable-chosen {
    color: rgb(233, 30, 99);
  }
}
</style>
