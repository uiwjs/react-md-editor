import path from 'path';
import webpack, { Configuration } from 'webpack';
import { LoaderConfOptions } from 'kkt';
import lessModules from '@kkt/less-modules';
import rawModules from '@kkt/raw-modules';
import reactLibrary from '@kkt/react-library';
import scopePluginOptions from '@kkt/scope-plugin-options';
import pkg from './package.json';

export default (conf: Configuration, env: 'production' | 'development', options: LoaderConfOptions) => {
  if (options.bundle) {
    conf = lessModules(conf, env, options);
    conf = reactLibrary(conf, env, {
      ...options,
      ...pkg,
      name: 'mdeditor',
      main: 'dist/mdeditor.js',
      // webpack externals options
      dependencies: {
        react: {
          root: 'React',
          commonjs2: 'react',
          commonjs: 'react',
          amd: 'react',
        },
        'react-dom': {
          root: 'ReactDOM',
          commonjs2: 'react-dom',
          commonjs: 'react-dom',
          amd: 'react-dom',
        },
      },
    });
  } else {
    conf = rawModules(conf, env, { ...options });
    conf = lessModules(conf, env, options);
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
          chunks: 'all', // async 对异步引入的代码分割 initial 对同步引入代码分割 all 对同步异步引入的分割都开启
          minSize: 30000, // 字节 引入的文件大于30kb才进行分割
          minChunks: 1, // 模块至少使用次数
          maxAsyncRequests: 30, // 同时加载的模块数量最多是_个，只分割出同时引入的前_个文件（按需加载模块）
          maxInitialRequests: 25, // 首页加载的时候引入的文件最多 _ 个（加载初始页面）
          automaticNameDelimiter: '~', // 缓存组和生成文件名称之间的连接符
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
