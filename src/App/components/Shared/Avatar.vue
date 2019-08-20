<template>
  <div :class="['initials-wrapper', circleClass]" :style="circleStyle">
    <span class="initials">{{initials}}</span>
  </div>
</template>

<script>
export default {
  name: "Avatar",
  props: {
    name: String,
    img: String,
    order: Number,
    palette: {
      type: Number,
      default: 0,
      validator: function(value) {
        return [0, 1, 2].indexOf(value) !== -1;
      }
    },
    size: {
      type: String,
      default: "default",
      validator: function(value) {
        // The value must match one of these strings
        return ["tiny", "small", "default", "large", "medium"].indexOf(value) !== -1;
      }
    }
  },
  computed: {
    initials() {
      return this.name && this.name[0];
    },
    circleClass() {
      switch (this.size) {
        case "tiny":
          return "avatar-circle-ty";
        case "small":
          return "avatar-circle-sm";
        case "large":
          return "avatar-circle-lg";
        case "medium":
          return "avatar-circle-md";
        default:
          return "avatar-circle";
      }
    },
    circleColor() {
      let color = "#79BCDF";
      if (this.palette == 0) {
        switch (this.order) {
          case 0:
            color = "#79BCDF";
            break;
          case 1:
            color = "#9D80C2";
            break;
          case 2:
            color = "#CC7D7D";
            break;
          case 3:
            color = "#E08C69";
            break;
          case 4:
            color = "#F4D053";
            break;
          case 5:
            color = "#81C280";
            break;
        }
      } else if (this.palette == 1) {
        switch (this.order) {
          case 0:
            color = "#B359A4";
            break;
          case 1:
            color = "#2389C7";
            break;
          case 2:
            color = "#82B960";
            break;
          case 3:
            color = "#DE8E30";
            break;
          case 4:
            color = "#E1C014";
            break;
          case 5:
            color = "#B54E4E";
            break;
        }
      } else if (this.palette == 2) {
        color = "#d83333";
      }

      return color;
      /*  var hash = 0;
      if (this.name.length == 0) return hash;
      for (var i = 0; i < this.name.length; i++) {
        hash = this.name.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Convert to 32bit integer
      }

      return "hsl(" + (hash % 360) + ",100%,30%)";*/
    },
    circleStyle() {
      return "background-color: " + this.circleColor;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.initials-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin avatar($size) {
  width: $size;
  height: $size;
  background-color: greenyellow;
  text-align: center;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  cursor: pointer;

  .initials {
    position: relative;
    font-size: $size * 0.5;
    line-height: $size * 0.5;
    color: #fff;
    font-family: "Courier New", monospace;
    font-weight: bold;
    cursor: pointer;
  }
}

.avatar-circle-ty {
  @include avatar(24px);
}

.avatar-circle-sm {
  @include avatar(45px);
}

.avatar-circle {
  @include avatar(100px);
}

.avatar-circle-lg {
  @include avatar(250px);
}

.avatar-circle-md {
  @include avatar(40px);
}
</style>
