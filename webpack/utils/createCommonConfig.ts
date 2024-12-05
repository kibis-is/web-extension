import { resolve } from 'node:path';
import type { Configuration } from 'webpack';

// constants
import { SRC_PATH } from '../constants';

/**
 * Creates a common config.
 * @returns {Configuration} a common configuration.
 */
export default function createCommonConfig(): Configuration {
  const clientPath = resolve(SRC_PATH, 'client');
  const commonPath = resolve(SRC_PATH, 'common');
  const extensionPath = resolve(SRC_PATH, 'extension');
  const middlewarePath = resolve(SRC_PATH, 'middleware');

  return {
    node: false,
    resolve: {
      alias: {
        // client
        ['@client/apps']: resolve(clientPath, 'apps'),
        ['@client/components']: resolve(clientPath, 'components'),
        ['@client/constants']: resolve(clientPath, 'constants'),
        ['@client/hooks']: resolve(clientPath, 'hooks'),
        ['@client/interceptors']: resolve(clientPath, 'interceptors'),
        ['@client/managers']: resolve(clientPath, 'managers'),
        ['@client/styles']: resolve(clientPath, 'styles'),
        ['@client/utils']: resolve(clientPath, 'utils'),

        // common
        ['@common/components']: resolve(commonPath, 'components'),
        ['@common/constants']: resolve(commonPath, 'constants'),
        ['@common/enums']: resolve(commonPath, 'enums'),
        ['@common/errors']: resolve(commonPath, 'errors'),
        ['@common/hooks']: resolve(commonPath, 'hooks'),
        ['@common/managers']: resolve(commonPath, 'managers'),
        ['@common/messages']: resolve(commonPath, 'messages'),
        ['@common/services']: resolve(commonPath, 'services'),
        ['@common/theme']: resolve(commonPath, 'theme'),
        ['@common/types']: resolve(commonPath, 'types'),
        ['@common/utils']: resolve(commonPath, 'utils'),

        // docs
        ['@docs']: resolve(SRC_PATH, 'docs'),

        // extension
        ['@extension/components']: resolve(extensionPath, 'components'),
        ['@extension/config']: resolve(extensionPath, 'config'),
        ['@extension/constants']: resolve(extensionPath, 'constants'),
        ['@extension/contracts']: resolve(extensionPath, 'contracts'),
        ['@extension/enums']: resolve(extensionPath, 'enums'),
        ['@extension/events']: resolve(extensionPath, 'events'),
        ['@extension/features']: resolve(extensionPath, 'features'),
        ['@extension/fonts']: resolve(extensionPath, 'fonts'),
        ['@extension/hooks']: resolve(extensionPath, 'hooks'),
        ['@extension/icons']: resolve(extensionPath, 'icons'),
        ['@extension/images']: resolve(extensionPath, 'images'),
        ['@extension/managers']: resolve(extensionPath, 'managers'),
        ['@extension/message-handlers']: resolve(
          extensionPath,
          'message-handlers'
        ),
        ['@extension/modals']: resolve(extensionPath, 'modals'),
        ['@extension/models']: resolve(extensionPath, 'models'),
        ['@extension/pages']: resolve(extensionPath, 'pages'),
        ['@extension/repositories']: resolve(extensionPath, 'repositories'),
        ['@extension/routers']: resolve(extensionPath, 'routers'),
        ['@extension/selectors']: resolve(extensionPath, 'selectors'),
        ['@extension/services']: resolve(extensionPath, 'services'),
        ['@extension/styles']: resolve(extensionPath, 'styles'),
        ['@extension/translations']: resolve(extensionPath, 'translations'),
        ['@extension/types']: resolve(extensionPath, 'types'),
        ['@extension/utils']: resolve(extensionPath, 'utils'),

        // middleware
        ['@middleware/message-brokers']: resolve(
          middlewarePath,
          'message-brokers'
        ),
        ['@middleware/utils']: resolve(middlewarePath, 'utils'),
      },
      extensions: ['.css', '.js', '.ts', '.tsx'],
    },

    stats: {
      assetsSpace: 100,
      modules: false,
    },
  };
}
