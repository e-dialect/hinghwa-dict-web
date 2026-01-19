module.exports = {
  // publicPath controls the base URL your application is deployed at.
  // For PR previews we set PREVIEW_BASE in CI (e.g. /pr-123/), otherwise default '/'.
  publicPath: process.env.PREVIEW_BASE || '/',
  configureWebpack: config => {
    config.module.rules.push({
      test: /\.worker.js$/,
      use: {
        loader: 'worker-loader',
        options: { inline: true, name: 'workerName.[hash].js' }
      }
    })
  },
  parallel: false,
  chainWebpack: config => {
    config.output.globalObject('this')
  }
}
