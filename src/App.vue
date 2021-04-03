<template>
  <v-app>
    <v-main>
      <Canvas v-on:mouseDown="closeMenu2" />
      <Menu2 ref="refMenu2" @explainWhy="explainingWhy = true" />
      <v-dialog v-if="explainingWhy" v-model="explainingWhy" fullscreen>
        <ExplanationWhy @windowClosed="explainingWhy = false" />
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import Canvas from "./components/Canvas";
import Menu2 from "./components/Menu2";
import ExplanationWhy from "./components/ExplanationWhy";

export default {
  name: "App",

  components: {
    Canvas,
    Menu2,
    ExplanationWhy,
  },
  methods: {
    closeMenu2() {
      this.$refs.refMenu2.closeMenu();
    },
  },
  data: () => ({
    explainingWhy: false,
  }),
};
</script>
<style>
html {
  overflow-y: auto !important;
  overflow: hidden !important; /* Hide scrollbars */
  width: 100%;
  height: 100%;
}
</style>
