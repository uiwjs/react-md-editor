import path from 'path';
import webpack, {Configuration} from 'webpack';
import { LoaderConfOptions } from 'kkt';
import lessModules from '@kkt/less-modules';
import rawModules from '@kkt/raw-modules';
import scopePluginOptions from '@kkt/scope-plugin-options';
import pkg from './package.json';

export default (conf: Configuration, env: 'production' | 'development', options: LoaderConfOptions) => {
  conf = rawModules(conf, env, { ...options });
  conf = lessModules(conf, env, options);
  conf = scopePluginOptions(conf, env, {
    ...options,
    allowedFiles: [
      path.resolve(process.cwd(), 'README.md')
    ]
  });
  // Get the project version.
  conf.plugins!.push(new webpack.DefinePlugin({
    VERSION: JSON.stringify(pkg.version),
  }));
  if (env === 'production') {
    conf.output = { ...conf.output, publicPath: './' }
  }
  return conf;
}
