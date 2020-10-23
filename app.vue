<template>
  <div>
    <p class="red">just text</p>
    <p>another</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      bundler: "Parcel",
    };
  },
});
</script>

<style lang="scss" scoped>
.red {
  color: green;
}
</style>