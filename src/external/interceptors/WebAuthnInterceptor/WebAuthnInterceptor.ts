import { randomString } from '@stablelib/random';
import I18next, { type i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';

// apps
import WebAuthnRegisterApp from '@external/apps/WebAuthnRegisterApp';

// managers
import WebAuthnMessageManager from '@external/managers/WebAuthnMessageManager';

// translations
import { en } from '@extension/translations';

// types
import type { IExternalConfig, ILogger } from '@common/types';
import type { IInitializeOptions, INewOptions } from './types';

// utils
import createClientInformation from '@common/utils/createClientInformation';
import createLogger from '@common/utils/createLogger';

export default class WebAuthnInterceptor {
  // private variables
  private _config: IExternalConfig;
  private _i18next: i18n | null;
  private readonly _rootElementID = randomString(12);
  private readonly _logger: ILogger | null;
  private readonly _navigatorCredentialsCreateFn: typeof navigator.credentials.create;
  private readonly _webAuthnMessageManager: WebAuthnMessageManager;

  private constructor({
    config,
    logger,
    navigatorCredentialsCreateFn,
    webAuthnMessageManager,
  }: INewOptions) {
    this._config = config || {
      debugLogging: __ENV__ === 'development',
      isInitialized: false,
      theme: {
        colorMode: 'light',
        font: 'Nunito',
      },
    };
    this._i18next = null;
    this._logger = logger || null;
    this._navigatorCredentialsCreateFn = navigatorCredentialsCreateFn;
    this._webAuthnMessageManager =
      webAuthnMessageManager || new WebAuthnMessageManager({ logger });
  }

  /**
   * public static methods
   */

  public static async initialize({
    navigatorCredentialsCreateFn,
  }: IInitializeOptions): Promise<WebAuthnInterceptor> {
    let logger = createLogger(__ENV__ === 'development' ? 'debug' : 'error');
    const webAuthnMessageManager = new WebAuthnMessageManager({ logger });
    const config = await webAuthnMessageManager.config(); // get the config

    if (config?.debugLogging) {
      logger = createLogger('debug');
    }

    return new WebAuthnInterceptor({
      logger,
      navigatorCredentialsCreateFn,
      webAuthnMessageManager,
      ...(config && { config }),
    });
  }

  /**
   * private methods
   */

  private async _initializeI18n(): Promise<i18n> {
    if (!this._i18next) {
      this._i18next = I18next.use(initReactI18next);

      await this._i18next.init({
        compatibilityJSON: 'v3',
        fallbackLng: 'en',
        debug: true,
        interpolation: {
          escapeValue: false,
        },
        resources: {
          en: {
            translation: en,
          },
        },
      });
    }

    return this._i18next;
  }

  private _createAppRoot(): Root {
    let rootElement = document.getElementById(this._rootElementID);

    if (!rootElement) {
      rootElement = document.createElement('div');

      rootElement.id = this._rootElementID;
    }

    document.body.appendChild(rootElement);

    // position in the top-right corner
    rootElement.style.position = 'fixed';
    rootElement.style.top = '0';
    rootElement.style.right = '0';
    rootElement.style.zIndex = '9999px';

    return createRoot(rootElement);
  }

  /**
   * public methods
   */

  public async create(
    options?: CredentialCreationOptions
  ): Promise<PublicKeyCredential | null> {
    return new Promise(async (resolve) => {
      const _functionName = 'create';
      const onAbortListener = (_: Event, _root: Root) => {
        // unmount the app
        if (_root) {
          root.unmount();
        }

        // clean up
        if (options?.signal) {
          options.signal.removeEventListener(
            'abort',
            onAbortListener.bind(this, _root)
          );
        }
      };
      let root: Root;

      // if the
      if (!this._config.isInitialized) {
        this._logger?.debug(
          `${WebAuthnInterceptor.name}#${_functionName}: provider has not been initialized`
        );

        return resolve(this._navigatorCredentialsCreateFn.call(this, options));
      }

      if (!options?.publicKey) {
        // if (!options?.publicKey?.pubKeyCredParams.find(({ alg }) => alg === -8)) {
        this._logger?.debug(
          `${WebAuthnInterceptor.name}#${_functionName}: public key credentials do not request "-8" (ed25519)"`
        );

        return resolve(this._navigatorCredentialsCreateFn.call(this, options));
      }

      root = this._createAppRoot();

      // handle abort signal
      if (options.signal) {
        options.signal.addEventListener(
          'abort',
          onAbortListener.bind(this, root)
        );
      }

      root.render(
        createElement(WebAuthnRegisterApp, {
          clientInfo: createClientInformation(),
          config: this._config,
          credentialCreationOptions: options,
          i18n: await this._initializeI18n(),
          navigatorCredentialsCreateFn: this._navigatorCredentialsCreateFn,
          onClose: () => root.unmount(),
          onResponse: (response: PublicKeyCredential | null) =>
            resolve(response),
          ...(this._logger && {
            logger: this._logger,
          }),
          webAuthnMessageManager: this._webAuthnMessageManager,
        })
      );
    });
  }
}
