// const purgecss = require('@fullhuman/postcss-purgecss')({
//   // Specify the paths to all of the template files in your project
//   content: ['./src/**/*.html', './src/**/*.vue', './src/**/*.js'],

//   // Include any special characters you're using in this regular expression
//   defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
// })
const purgecss = require('@fullhuman/postcss-purgecss')
const cssnano = require('cssnano')

module.exports = {
  plugins: [
    // ...
    require('tailwindcss'),
    require('autoprefixer'),
    // ...(process.env.NODE_ENV === 'production' ? [purgecss] : [])
    process.env.NODE_ENV === 'production'
      ? cssnano({ preset: 'default' })
      : null,
    process.env.NODE_ENV === 'production'
      ? purgecss({
          content: ['./src/**/*.html', './src/**/*.vue', './src/**/*.jsx'],
          defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
        })
      : null
  ]
}
