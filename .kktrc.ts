import path from 'path';
import webpack, { Configuration } from 'webpack';
import { LoaderConfOptions } from 'kkt';
import lessModules from '@kkt/less-modules';
import rawModules from '@kkt/raw-modules';
import scopePluginOptions from '@kkt/scope-plugin-options';
import pkg from './package.json';

export default (conf: Configuration, env: 'production' | 'development', options: LoaderConfOptions) => {
  conf = lessModules(conf, env, options);
  if (options.bundle) {
    conf.output!.library = '@uiw/react-md-editor';
    conf.externals = {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
    };
  } else {
    conf = rawModules(conf, env, { ...options });
    conf = scopePluginOptions(conf, env, {
      ...options,
      allowedFiles: [path.resolve(process.cwd(), 'README.md')],
    });
    // Get the project version.
    conf.plugins!.push(
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(pkg.version),
      }),
    );
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
              chunks: 'async',
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
  }
  return conf;
};
