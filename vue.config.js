const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin //引入webpack-bundle-analyzer
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const resolve = dir => path.join(__dirname, dir)

module.exports = {
  chainWebpack: config => {
    config.plugin('analyzer').use(new BundleAnalyzerPlugin()) //使用webpack-bundle-analyzer 生成报表
    config.plugin('loadshReplace').use(new LodashModuleReplacementPlugin()) //优化lodash
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  devServer: {
    proxy: `${process.env.VUE_APP_BASE_API}/app/`
  }
}
