

import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        light: true,
        themes: {
            light: {
                primary: 'white',
                secondary: 'grey',
                accent: 'grey',
                error: 'red',
            },
        },
    },
    icons: {
    },
});