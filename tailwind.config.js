module.exports = {
  theme: {
    transform: {
      // defaults to this value
      none: 'none'
    },
    transformOrigin: {
      // defaults to these values
      t: 'top',
      tr: 'top right',
      r: 'right',
      br: 'bottom right',
      b: 'bottom',
      bl: 'bottom left',
      l: 'left',
      tl: 'top left'
    },
    translate: {
      // defaults to {}
      '0': '0%',
      '1/2': '50%',
      '-1/2': '-50%',
      '6': '1.5rem',
      full: '100%',
      '-full': '-100%',
      'right-up': ['100%', '-100%'],
      '3d': ['40px', '-60px', '-130px']
    },
    transition: {
      none: 'none',
      all: 'all',
      opacity: 'opacity',
      transform: 'transform'
    },
    scale: {
      // defaults to {}
      '90': '0.9',
      '100': '1',
      '110': '1.1',
      '-100': '-1',
      'stretched-x': ['2', '0.5'],
      'stretched-y': ['0.5', '2'],
      '3d': ['0.5', '1', '2']
    },
    rotate: {
      // defaults to {}
      '90': '90deg',
      '180': '180deg',
      '270': '270deg',
      '3d': ['0', '1', '0.5', '45deg']
    },
    skew: {
      // defaults to {}
      '-5': '-5deg',
      '5': '5deg'
    },
    perspective: {
      // defaults to {}
      none: 'none',
      '250': '250px',
      '500': '500px',
      '750': '750px',
      '1000': '1000px'
    },
    perspectiveOrigin: {
      // defaults to these values
      t: 'top',
      tr: 'top right',
      r: 'right',
      br: 'bottom right',
      b: 'bottom',
      bl: 'bottom left',
      l: 'left',
      tl: 'top left'
    },
    extend: {
      spacing: {
        '9': '2.25rem'
      },
      minHeight: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        '500': '500px'
      }
    }
  },
  variants: {
    transition: ['responsive'],
    transform: ['responsive'],
    transformOrigin: ['responsive'],
    translate: ['responsive'],
    scale: ['responsive'],
    rotate: ['responsive'],
    skew: ['responsive'],
    perspective: ['responsive'],
    perspectiveOrigin: ['responsive'],
    transformStyle: ['responsive'],
    backfaceVisibility: ['responsive'],
    transformBox: ['responsive']
  },
  plugins: [
    require('@tailwindcss/custom-forms'),
    require('tailwindcss-transforms')({
      '3d': false // defaults to false
    })
  ]
}
