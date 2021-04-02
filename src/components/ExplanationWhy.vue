<template>
  <v-container>
    <v-row justify="center">
      <v-card max-width="500px">
        <v-app-bar dark color="primary">
          <v-icon x-large>mdi-help-circle</v-icon>
          <span class="headline">About this project</span>
        </v-app-bar>
        <v-container>
          <v-card-title>Draw a distinction!</v-card-title>
          <v-card-text>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras id
              felis eros. Fusce nisl purus, dictum ullamcorper varius eget,
              pulvinar sed ligula. Vestibulum ante ipsum primis in faucibus orci
              luctus et ultrices posuere cubilia curae; Donec varius gravida
              justo in egestas. Praesent feugiat arcu libero, ultrices auctor
              dolor ullamcorper vitae. Integer finibus dignissim nisi sit amet
              bibendum. Nam venenatis nunc pretium augue suscipit, in faucibus
              libero tempor. Maecenas quis enim hendrerit, bibendum nulla quis,
              lacinia massa. Nulla et leo sem. Vivamus sit amet lectus placerat,
              rhoncus eros blandit, ultrices libero
            </p>
            <p>
              Maecenas nibh enim, auctor ultricies nisl eget, commodo volutpat
              risus. Phasellus finibus pulvinar lobortis. Vestibulum ac dictum
              dolor. Nam fringilla purus leo, ut interdum risus hendrerit eu.
              Donec a odio in eros pretium laoreet. Curabitur semper neque id
              viverra sagittis. Duis ex enim, sollicitudin feugiat elit ac,
              volutpat ultricies eros. Donec sollicitudin mi a posuere placerat.
              Praesent iaculis, erat non scelerisque consectetur, augue erat
              tempor leo, quis malesuada nulla arcu eget ante. Vivamus sit amet
              nisl aliquam, lobortis risus eget, consectetur nisl. Cras
              faucibus, purus at commodo venenatis, purus dolor venenatis enim,
              ac egestas velit nulla sit amet ipsum. Nam ac turpis dictum,
              ultrices nibh non, efficitur tellus.
            </p>
            <p>
              Cras lectus ante, molestie ut bibendum ac, volutpat nec enim.
              Praesent turpis purus, placerat eu semper et, tristique non sem.
              Fusce interdum nunc arcu, ac pretium leo ultrices eu. Integer ac
              diam nulla. Suspendisse auctor, dui nec consequat varius, eros
              diam luctus tellus, at pulvinar massa nisl ut metus. Curabitur
              convallis, metus nec finibus blandit, libero nibh viverra massa,
              ac bibendum nisl dolor eu eros. Suspendisse bibendum sollicitudin
              nisl a ullamcorper. Nullam et mi egestas, pellentesque nibh in,
              vulputate odio.
            </p>
            <p>
              Aliquam sit amet ipsum nec purus varius condimentum. Sed vitae
              convallis magna, a venenatis leo. Curabitur ullamcorper erat eget
              urna vehicula tristique. Proin augue risus, tincidunt sagittis
              lacus vitae, dapibus faucibus felis. Aliquam at orci eu nulla
              ornare mollis. Aenean tincidunt augue id urna tempor elementum.
              Nullam ac urna sed felis gravida cursus.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              dark
              fab
              bottom
              right
              color="primary"
              @click="$emit('windowClosed')"
            >
              <v-icon>mdi-check-bold</v-icon>
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>