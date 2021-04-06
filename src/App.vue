<template>
  <v-app>
    <v-main>
      <Space @blur="closeMenu2" v-on:mouseDown="closeMenu2" />
      <MenuProjects ref="menuProjects" @explainWhy="explainingWhy = true" />
      <v-dialog :fullscreen="$vuetify.breakpoint.mdAndDown" scrollable v-if="explainingWhy" max-width="600" v-model="explainingWhy">
        <ExplanationWhy @windowClosed="explainingWhy = false" />
      </v-dialog>
      <v-dialog persistent v-model="askForUpdate" v-if="askForUpdate" max-width="290">
        <v-card>
          <v-card-title class="headline"> Update available </v-card-title>
          <v-card-text
            >New update available. Do you want to update now?</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="askForUpdate = false">
              Disagree
            </v-btn>
            <v-btn color="green darken-1" text @click="update"> Agree </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import Space from "./components/Space";
import MenuProjects from "./components/MenuProjects";
import ExplanationWhy from "./components/ExplanationWhy";

export default {
  name: "App",

  components: {
    Space,
    MenuProjects,
    ExplanationWhy,
  },
  methods: {
    closeMenu2() {
      this.$refs.menuProjects.closeMenu();
    },
    async update() {
      this.askForUpdate = false;
      console.log("Updating...");
      await this.$workbox.messageSW({ type: "SKIP_WAITING" });
    },
  },
  data: () => ({
    explainingWhy: true,
    askForUpdate: false,
  }),
  mounted: function () {
    if (this.$workbox) {
      this.$workbox.addEventListener("waiting", () => {
        console.log("Update available");
        this.askForUpdate = true;
      });
    }
  },
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
