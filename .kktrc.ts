import path from 'path';

export const moduleScopePluginOpts = [
  path.resolve(process.cwd(), 'README.md'),
];

export const loaderOneOf = [
  [require.resolve('@kkt/loader-less'), {}],
]

export default (conf, opts, webpack) => {
  const pkg = require(path.resolve(process.cwd(), 'package.json'));
  conf.module.rules.map((item) => {
    if (item.oneOf) {
      item.oneOf.unshift({
        test: /\.md$/,
        use: require.resolve('raw-loader'),
      });
    }
    return item;
  });
  // 获取版本
  conf.plugins.push(
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version),
    })
  );
  return conf;
}
