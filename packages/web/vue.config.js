const path = require("path");

module.exports = {
  transpileDependencies: ["vuetify"],
  outputDir: path.resolve(__dirname, "../../dist/web"),

  pluginOptions: {
    i18n: {
      locale: undefined,
      fallbackLocale: undefined,
      localeDir: undefined,
      enableInSFC: undefined
    }
  },

  devServer: {
    progress: false
  }
};
