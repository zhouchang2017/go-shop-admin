const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin //引入webpack-bundle-analyzer
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
const CompressionWebpackPlugin = require('compression-webpack-plugin')

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
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: productionGzipExtensions,
            threshold: 2048,
            minRatio: 0.8
          })
        ]
      }
    }
  },
  devServer: {
    proxy: `${process.env.VUE_APP_BASE_API}/app/`
  }
}
