<template>
  <v-menu left bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn small absolute top right color="primary" v-bind="attrs" v-on="on">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item>
        <v-btn href="https://futureofmaking.de" target="_blank" text>
          <span class="mr-2">DNA-Synthesizer</span>
          <v-icon>mdi-dna</v-icon>
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn href="https://epidemic-simulations.web.app" target="_blank" text>
          <span class="mr-2">Epidemic Simulations</span>
          <v-icon>mdi-trending-up</v-icon>
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn href="https://cellular-narratives.web.app/" target="_blank" text>
          <span class="mr-2">Cellular Narratives</span>
          <v-icon>mdi-account-switch-outline</v-icon>
        </v-btn>
      </v-list-item>

      <v-list-item>
        <v-btn href="https://creaition-webapp.web.app" target="_blank" text>
          <span class="mr-2">Cre[ai]tion</span>
          <v-icon>mdi-robot</v-icon>
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn text @click="$emit('explainWhy')">
          <span class="mr-2">About</span>
          <v-icon>mdi-help-circle</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "Menu2",
  methods : {
  }
};
</script>