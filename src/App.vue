<template>
  <v-app>
    <v-main>
      <HelloWorld/>
      <Canvas />
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import Canvas from '@/components/Canvas';

export default {
  name: 'App',

  components: {
    HelloWorld,
    Canvas
  },

  data: () => ({
    //
  }),
};
</script>
