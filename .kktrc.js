const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

/**
 * Bundles a minified and unminified version of UIW including
 * all it's immediate dependencies (excluding React, ReactDOM, etc)
 */
module.exports = {
  plugins: [
    require.resolve('@kkt/plugin-less'),
  ],
  // Modify the webpack config
  config: (conf, { env, raw, ...other }, webpack) => {
    conf.entry = './website/index.tsx';
    if (env === 'prod' && raw.BUNDLE) {
    }

    // Parsing Markdown files
    conf.module.rules = [
      ...conf.module.rules,
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
    ];

    if (env === 'prod') {
      // Webpack configuration changed in production mode
      conf.entry[0] = path.resolve(process.cwd(), 'website');
      conf.output.publicPath = './';
      conf.output.path = path.resolve(__dirname, 'doc');
    } else {
      conf.entry[1] = path.resolve(process.cwd(), 'website', 'index.js');
    }
    return conf;
  },
};
