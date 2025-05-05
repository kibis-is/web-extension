import { resolve } from 'node:path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import type { Configuration } from 'webpack';

/**
 * Creates a common config.
 * @returns {Configuration} a common configuration.
 */
export default function createCommonConfig(): Configuration {
  return {
    node: false,

    resolve: {
      extensions: ['.css', '.js', '.ts', '.tsx'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: resolve(process.cwd(), 'tsconfig.json'),
        }),
      ],
    },

    stats: {
      assetsSpace: 100,
      modules: false,
    },
  };
}
