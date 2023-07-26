import webpack, { Configuration } from 'webpack';
import { LoaderConfOptions } from 'kkt';
import { mdCodeModulesLoader } from 'markdown-react-code-preview-loader';
import pkg from './package.json';

export default (conf: Configuration, env: 'production' | 'development', options: LoaderConfOptions) => {
  conf = mdCodeModulesLoader(conf);
  // Get the project version.
  conf.plugins!.push(
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version),
    }),
  );
  conf.module!.exprContextCritical = false;
  if (env === 'production') {
    conf.optimization = {
      ...conf.optimization,
      splitChunks: {
        cacheGroups: {
          reactvendor: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react-vendor',
            chunks: 'all',
          },
          katex: {
            test: /[\\/]node_modules[\\/](katex)[\\/]/,
            name: 'katex-vendor',
            chunks: 'all',
          },
          mermaid: {
            test: /[\\/]node_modules[\\/](mermaid)[\\/]/,
            name: 'mermaid-vendor',
            chunks: 'all',
          },
          dagred3: {
            test: /[\\/]node_modules[\\/](dagre-d3)[\\/]/,
            name: 'dagre-d3-vendor',
            chunks: 'all',
          },
          momentlodash: {
            test: /[\\/]node_modules[\\/](moment-mini|lodash|d3-array|d3-geo|d3-shape|dagre)[\\/]/,
            name: 'momentlodash-vendor',
            chunks: 'all',
          },
          d3: {
            test: /[\\/]node_modules[\\/](d3-\w+(-?\w+))[\\/]/,
            name: 'd3-vendor',
            chunks: 'all',
          },
          micromark: {
            test: /[\\/]node_modules[\\/](micromark)[\\/]/,
            name: 'micromark-vendor',
            chunks: 'all',
          },
          prismjs: {
            test: /[\\/]node_modules[\\/](refractor)[\\/]/,
            name: 'refractor-prismjs-vendor',
            chunks: 'all',
          },
          runtime: {
            test: /[\\/]node_modules[\\/](@babel[\\/]runtime)[\\/]/,
            name: 'babel-runtime-vendor',
            chunks: 'all',
          },
          parse5: {
            test: /[\\/]node_modules[\\/](parse5)[\\/]/,
            name: 'parse5-vendor',
            chunks: 'all',
          },
        },
      },
    };
    conf.output = { ...conf.output, publicPath: './' };
  }
  return conf;
};
