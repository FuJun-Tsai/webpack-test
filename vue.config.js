// module.exports = {
//   filenameHashing: false,
//   productionSourceMap: false,
//   // outputDir: 'main',
//   configureWebpack: {
//     optimization: {
//       splitChunks: {
//         cacheGroups: {
//           'echart': {
//             name: 'echart',
//             test: /[\\/]node_modules[\\/](echart)/,
//             chunks: 'all',
//             priority: 8,
//             enforce: true
//           },
//           'Nintendo': {
//             name: 'Nintendo',
//             test: /[\\/]src[\\/]customer[\\/]Nintendo/,
//             chunks: 'all',
//             priority: 8,
//             enforce: true,
//             filename: 'Nintendo/customer.js',
//           },
//           'Sony': {
//             name: 'Sony',
//             test: /[\\/]src[\\/]customer[\\/]Sony/,
//             chunks: 'all',
//             priority: 8,
//             enforce: true,
//             filename: 'Sony/customer.js',
//           },
//         },
//       },
//     },
//   },
//   // chainWebpack: config => {
//   //   config.plugins.delete('html')
//   //   config.plugins.delete('preload')
//   //   config.plugins.delete('prefetch')
//   // },
// }

module.exports = () => {
  return {
    filenameHashing: false,
    productionSourceMap: false,
    // outputDir: 'main',
    configureWebpack: {
      optimization: {
        splitChunks: {
          cacheGroups: {
            'echart': {
              name: 'echart',
              test: /[\\/]node_modules[\\/](echart)/,
              chunks: 'all',
              priority: 8,
              enforce: true
            },
            'Nintendo': {
              name: 'Nintendo',
              test: /[\\/]src[\\/]customer[\\/]Nintendo/,
              chunks: 'all',
              priority: 8,
              enforce: true,
              filename: 'Nintendo/customer.js',
            },
            'Sony': {
              name: 'Sony',
              test: /[\\/]src[\\/]customer[\\/]Sony/,
              chunks: 'all',
              priority: 8,
              enforce: true,
              filename: 'Sony/customer.js',
            },
          },
        },
      },
    },
    // chainWebpack: config => {
    //   config.plugins.delete('html')
    //   config.plugins.delete('preload')
    //   config.plugins.delete('prefetch')
    // },
  }
}