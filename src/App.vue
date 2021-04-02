<template>
  <v-app>
    <v-main>
      <Canvas />
    </v-main>
    <Menu2 @explainWhy="explainingWhy = true" />

    <v-dialog v-model="explainingWhy" fullscreen>
      <ExplanationWhy @windowClosed="explainingWhy = false" />
    </v-dialog>
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
    ExplanationWhy
  },
  methods : {
  },
  data: () => ({
    explainingWhy: false
  }),
};
</script>
<style>
html {
  overflow-y: auto !important;
  overflow: hidden !important; /* Hide scrollbars */
}
</style>
