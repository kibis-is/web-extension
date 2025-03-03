import { resolve } from 'node:path';
import type { Configuration } from 'webpack';

// constants
import { SRC_PATH } from '../constants';

/**
 * Creates a common config.
 * @returns {Configuration} a common configuration.
 */
export default function createCommonConfig(): Configuration {
  return {
    node: false,
    resolve: {
      alias: {
        ['@client']: resolve(SRC_PATH, 'client'),
        ['@common']: resolve(SRC_PATH, 'common'),
        ['@docs']: resolve(SRC_PATH, 'docs'),
        ['@extension']: resolve(SRC_PATH, 'docs'),
        ['@middleware']: resolve(SRC_PATH, 'middleware'),
      },
      extensions: ['.css', '.js', '.ts', '.tsx'],
    },

    stats: {
      assetsSpace: 100,
      modules: false,
    },
  };
}
