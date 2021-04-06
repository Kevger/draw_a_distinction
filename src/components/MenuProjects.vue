<template>
  <v-menu ref="refMenuProjects" left bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        style="position: absolute; top: 1%; right: 1%"
        small
        color="primary"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>{{mdiDotsVertical}}</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item>
        <v-btn href="https://futureofmaking.de" target="_blank" text>
          <span class="mr-2">DNA-Synthesizer</span>
          <v-icon>{{mdiDna}}</v-icon>
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn href="https://epidemic-simulations.web.app" target="_blank" text>
          <span class="mr-2">Epidemic Simulations</span>
          <v-icon>{{mdiTrendingUp}}</v-icon>
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn href="https://cellular-narratives.web.app/" target="_blank" text>
          <span class="mr-2">Cellular Narratives</span>
          <v-icon>{{mdiAccountSwitchOutline}}</v-icon>
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn text @click="$emit('explainWhy')">
          <span class="mr-2">About</span>
          <v-icon>{{mdiHelpCircle}}</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import {
      mdiDotsVertical,
      mdiDna,
      mdiTrendingUp,
      mdiAccountSwitchOutline,
      mdiHelpCircle,
} from "@mdi/js";

export default {
  name: "MenuProjects",
  methods: {
    closeMenu() {
      this.$refs.refMenuProjects.isActive = false;
    },
  },
  data: () => {
    return {
      mdiDotsVertical,
      mdiDna,
      mdiTrendingUp,
      mdiAccountSwitchOutline,
      mdiHelpCircle,
    };
  },
};
</script>