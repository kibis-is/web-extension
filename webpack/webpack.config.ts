import CopyPlugin from 'copy-webpack-plugin';
import { config } from 'dotenv';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'node:path';
import { Configuration, DefinePlugin, RuleSetRule } from 'webpack';
import { Configuration as DevelopmentConfiguration } from 'webpack-dev-server';
import { merge } from 'webpack-merge';

// config
import { version } from '../package.json';

// enums
import { ConfigNameEnum, EnvironmentEnum, TargetEnum } from './enums';

// constants
import {
  APP_TITLE,
  CHROME_BUILD_PATH,
  DAPP_EXAMPLE_BUILD_PATH,
  DAPP_EXAMPLE_SRC_PATH,
  EDGE_BUILD_PATH,
  FIREFOX_BUILD_PATH,
  SRC_PATH,
} from './constants';

// plugins
import ManifestBuilderPlugin from './plugins/ManifestBuilderPlugin';
import WebExtPlugin from './plugins/WebExtPlugin';

// types
import { IWebpackEnvironmentVariables } from './types';

// utils
import { createCommonConfig } from './utils';

const configs: (
  env: IWebpackEnvironmentVariables
) => (Configuration | DevelopmentConfiguration)[] = ({
  environment = EnvironmentEnum.Development,
  target = TargetEnum.Firefox,
}: IWebpackEnvironmentVariables) => {
  // misc
  let commonConfig: Configuration;
  let dappExamplePort: number;
  let devtool: string | false | undefined;
  let maxSize: number;
  // paths
  let buildPath: string;
  let extensionPath: string;
  let manifestPaths: string[];
  let tsConfigBuildPath: string;
  // performance
  let optimization: Record<string, unknown>;
  let output: Record<string, unknown>;
  let performance: Record<string, unknown> | false;
  // plugins
  let definePlugin: DefinePlugin;
  // rules
  let fontLoaderRule: RuleSetRule;
  let handleBarsLoaderRule: RuleSetRule;
  let imageLoaderRule: RuleSetRule;
  let markdownLoaderRule: RuleSetRule;
  let stylesLoaderRule: RuleSetRule;
  let tsLoaderRule: RuleSetRule;

  // load .env file
  config();

  extensionPath = resolve(SRC_PATH, 'extension');
  tsConfigBuildPath = resolve(process.cwd(), 'tsconfig.build.json');
  commonConfig = createCommonConfig();
  dappExamplePort = 8080;
  definePlugin = new DefinePlugin({
    __APP_TITLE__: JSON.stringify(APP_TITLE),
    __ENV__: JSON.stringify(environment),
    __PROVIDER_ID__: JSON.stringify(process.env.PROVIDER_ID),
    __TARGET__: JSON.stringify(target),
    __VERSION__: JSON.stringify(version),
  });
  fontLoaderRule = {
    test: /\.(svg?.+|ttf?.+|woff?.+|woff2?.+)$/,
    type: 'asset/resource',
  };
  handleBarsLoaderRule = {
    loader: 'handlebars-loader',
    test: /\.hbs$/,
  };
  imageLoaderRule = {
    test: /\.(png|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  };
  markdownLoaderRule = {
    test: /\.md/,
    use: 'raw-loader',
  };
  maxSize = 4000000; // 4 MB
  stylesLoaderRule = {
    test: /\.css$/i,
    use: [
      {
        loader: 'style-loader',
        options: {
          injectType: 'styleTag',
        },
      },
      {
        loader: 'css-loader',
        options: {
          url: true,
        },
      },
    ],
  };
  tsLoaderRule = {
    exclude: /node_modules/,
    test: /\.tsx?$/,
    use: [
      {
        loader: 'thread-loader',
      },
      {
        loader: 'ts-loader',
        options: {
          configFile: tsConfigBuildPath,
          happyPackMode: true,
        },
      },
    ],
  };

  switch (target) {
    case TargetEnum.Chrome:
      buildPath = CHROME_BUILD_PATH;
      manifestPaths = [
        resolve(SRC_PATH, 'manifest.common.json'),
        resolve(SRC_PATH, `manifest.v3.json`),
      ];
      break;
    case TargetEnum.Edge:
      buildPath = EDGE_BUILD_PATH;
      manifestPaths = [
        resolve(SRC_PATH, 'manifest.common.json'),
        resolve(SRC_PATH, `manifest.v3.json`),
      ];
      break;
    // default to firefox
    case TargetEnum.Firefox:
    default:
      buildPath = FIREFOX_BUILD_PATH;
      manifestPaths = [
        resolve(SRC_PATH, 'manifest.common.json'),
        resolve(SRC_PATH, `manifest.v2.json`),
        resolve(SRC_PATH, `manifest.firefox.json`),
      ];
      break;
  }

  switch (environment) {
    case EnvironmentEnum.Production:
      devtool = 'source-map';
      optimization = {
        splitChunks: {
          cacheGroups: {
            default: false,
            ['dompurify']: {
              chunks: 'all',
              maxSize,
              name: 'dompurify',
              priority: 90,
              reuseExistingChunk: true,
              test: /[\\/]node_modules[\\/]dompurify[\\/]/,
            },
            ['lodash.isequal']: {
              chunks: 'all',
              maxSize,
              name: 'lodash.isequal',
              priority: 90,
              reuseExistingChunk: true,
              test: /[\\/]node_modules[\\/]lodash.isequal[\\/]/,
            },
            ['lodash.mergewith']: {
              chunks: 'all',
              maxSize,
              name: 'lodash.mergewith',
              priority: 90,
              reuseExistingChunk: true,
              test: /[\\/]node_modules[\\/]lodash.mergewith[\\/]/,
            },
            ['react-dom']: {
              chunks: 'all',
              maxSize,
              name: 'react-dom',
              priority: 90,
              reuseExistingChunk: true,
              test: /[\\/]node_modules[\\/]react-dom[\\/]/,
            },
            // needs to be isolates as when this is bundled, it causes an UNSAFE_VAR_ASSIGNMENT warning in Firefox validation
            ['react-focus-lock']: {
              chunks: 'all',
              maxSize,
              name: 'react-focus-lock',
              priority: 90,
              reuseExistingChunk: true,
              test: /[\\/]node_modules[\\/]react-focus-lock[\\/]/,
            },
            vendor: {
              chunks: 'all',
              maxSize,
              name: 'vendor',
              priority: 10,
              reuseExistingChunk: true,
              test: /[\\/]node_modules[\\/]/,
            },
          },
        },
      };
      output = {
        filename: '[name].js',
        path: buildPath,
      };
      performance = {
        hints: 'warning',
        maxAssetSize: maxSize,
        maxEntrypointSize: 10000000, // 10 MB
      };

      break;
    // default to development
    case EnvironmentEnum.Development:
    default:
      devtool = 'cheap-module-source-map';
      optimization = {
        removeAvailableModules: true,
        removeEmptyChunks: true,
        splitChunks: false,
      };
      output = {
        filename: '[name].js',
        path: buildPath,
        pathinfo: false,
      };
      performance = false;

      break;
  }

  return [
    /**
     * background, content & injected scripts and the manifest.json file
     */
    merge(commonConfig, {
      devtool,
      entry: {
        ['client']: resolve(SRC_PATH, 'client', 'main.ts'),
        ['middleware']: resolve(SRC_PATH, 'middleware', 'main.ts'),
        ['provider']: resolve(SRC_PATH, 'extension', 'main.ts'),
      },
      mode: environment,
      module: {
        rules: [
          {
            test: /\.(svg?.+|ttf?.+|woff?.+|woff2?.+)$/,
            type: 'asset/inline',
          },
          stylesLoaderRule,
          tsLoaderRule,
        ],
      },
      name: ConfigNameEnum.ExtensionScripts,
      optimization: {
        removeAvailableModules: true,
        removeEmptyChunks: true,
        splitChunks: false, // extension scripts need to have dependencies bundled
      },
      output: {
        ...output,
        clean: true,
      },
      plugins: [definePlugin, new ManifestBuilderPlugin(...manifestPaths)],
    }),

    /**
     * extension apps
     */
    merge(commonConfig, {
      devtool,
      entry: {
        ['background-app']: resolve(
          extensionPath,
          'apps',
          'background',
          'index.ts'
        ),
        ['main-app']: resolve(extensionPath, 'apps', 'main', 'index.ts'),
        ['registration-app']: resolve(
          extensionPath,
          'apps',
          'registration',
          'index.ts'
        ),
      },
      mode: environment,
      module: {
        rules: [
          tsLoaderRule,
          stylesLoaderRule,
          handleBarsLoaderRule,
          fontLoaderRule,
          imageLoaderRule,
          markdownLoaderRule,
        ],
      },
      name: ConfigNameEnum.ExtensionApps,
      optimization,
      output,
      performance,
      plugins: [
        new CopyPlugin({
          patterns: [
            {
              from: resolve(SRC_PATH, 'icons'),
              to: resolve(buildPath, 'icons'),
            },
          ],
        }),
        definePlugin,
        new HtmlWebpackPlugin({
          chunks: ['background-app'],
          filename: 'background-app.html',
          inject: 'head',
          template: resolve(SRC_PATH, 'index.hbs'),
          title: APP_TITLE,
        }),
        new HtmlWebpackPlugin({
          chunks: ['main-app'],
          filename: 'main-app.html',
          inject: 'head',
          template: resolve(SRC_PATH, 'index.hbs'),
          title: APP_TITLE,
        }),
        new HtmlWebpackPlugin({
          chunks: ['registration-app'],
          filename: 'registration-app.html',
          inject: 'head',
          template: resolve(SRC_PATH, 'index.hbs'),
          title: APP_TITLE,
        }),
        ...(environment === EnvironmentEnum.Development &&
        (target === TargetEnum.Chrome || target === TargetEnum.Firefox)
          ? [
              new WebExtPlugin({
                buildPath,
                devtools: true,
                persistState: true,
                startUrls: [`http://localhost:${dappExamplePort}`], // navigate to the dapp
                target,
              }),
            ]
          : []),
      ],
    }),

    /**
     * dapp example
     */
    merge(commonConfig, {
      devtool:
        environment === EnvironmentEnum.Production
          ? 'source-map'
          : 'eval-source-map',
      devServer: {
        port: dappExamplePort,
        watchFiles: [`${DAPP_EXAMPLE_SRC_PATH}/**/*`],
      },
      entry: {
        ['main']: resolve(DAPP_EXAMPLE_SRC_PATH, 'index.ts'),
      },
      mode: environment,
      module: {
        rules: [
          {
            exclude: /node_modules/,
            test: /\.tsx?$/,
            use: [
              {
                loader: 'ts-loader',
                options: {
                  configFile: resolve(process.cwd(), 'tsconfig.example.json'),
                  transpileOnly: true,
                },
              },
            ],
          },
          stylesLoaderRule,
          handleBarsLoaderRule,
          fontLoaderRule,
        ],
      },
      name: ConfigNameEnum.DappExample,
      optimization: {
        removeAvailableModules: true,
        removeEmptyChunks: true,
        splitChunks: false,
      },
      output: {
        clean: true,
        filename: '[name].js',
        path: DAPP_EXAMPLE_BUILD_PATH,
        pathinfo: false,
        ...(environment === EnvironmentEnum.Production && {
          publicPath: '/kibisis-web-extension/', // as this is being deployed to github pages, the public path needs to be set the path in the default github pages: https://<your-username>.github.io/<your-repository>/
        }),
      },
      plugins: [
        new DefinePlugin({
          __PROVIDER_ID__: JSON.stringify(process.env.PROVIDER_ID),
        }),
        new HtmlWebpackPlugin({
          chunks: ['main'],
          favicon: resolve(DAPP_EXAMPLE_SRC_PATH, 'favicon.png'),
          filename: 'index.html',
          inject: 'body',
          template: resolve(DAPP_EXAMPLE_SRC_PATH, 'index.hbs'),
          title: `${APP_TITLE} dApp Example`,
        }),
      ],
    }),
  ];
};

export default configs;
