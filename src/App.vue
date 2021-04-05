<template>
  <v-app>
    <v-main>
      <Canvas @blur="closeMenu2" v-on:mouseDown="closeMenu2" />
      <MenuProjects ref="menuProjects" @explainWhy="explainingWhy = true" />
      <v-dialog v-if="explainingWhy" v-model="explainingWhy" fullscreen>
        <ExplanationWhy @windowClosed="explainingWhy = false" />
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import Canvas from "./components/Canvas";
import MenuProjects from "./components/MenuProjects";
import ExplanationWhy from "./components/ExplanationWhy";

export default {
  name: "App",

  components: {
    Canvas,
    MenuProjects,
    ExplanationWhy,
  },
  methods: {
    closeMenu2() {
      this.$refs.menuProjects.closeMenu();
    },
  },
  data: () => ({
    explainingWhy: true,
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
