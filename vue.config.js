const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
  publicPath: '',

  transpileDependencies: [
    'vuetify'
  ],
  pwa: {
    name: 'Laws of Form',
    short_name: 'LoF',
    themeColor: "#42b983",
    msTileColor: "#42b983",
    appleMobileWebAppCache: "yes",
    manifestOptions: {
      background_color: "#42b983"
    }
  },
  configureWebpack: {
    plugins: [new GenerateSW()]
  }
}