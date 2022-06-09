// import path from 'path';
import { Configuration } from 'webpack';
import { LoaderConfOptions } from 'kkt';
import lessModules from '@kkt/less-modules';
// import rawModules from '@kkt/raw-modules';
// import pkg from './package.json';

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
  }
  return conf;
};
