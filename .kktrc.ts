import { OptionConf, LoaderOneOf, ModuleScopePluginOpts } from 'kkt';
import webpack from 'webpack';
import path from 'path';

type Webpack = typeof webpack;

export const moduleScopePluginOpts: ModuleScopePluginOpts = [
  path.resolve(process.cwd(), 'README.md'),
];

export const loaderOneOf: LoaderOneOf = [
  [require.resolve('@kkt/loader-less'), {}],
]

export default (conf: webpack.Configuration, options: OptionConf, webpack: Webpack) => {
  const pkg = require(path.resolve(process.cwd(), 'package.json'));
  conf.module!.rules.map((item) => {
    if (item.oneOf) {
      item.oneOf.unshift({
        test: /\.md$/,
        use: require.resolve('raw-loader'),
      });
    }
    return item;
  });
  // 获取版本
  conf.plugins!.push(
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version),
    })
  );
  return conf;
}
