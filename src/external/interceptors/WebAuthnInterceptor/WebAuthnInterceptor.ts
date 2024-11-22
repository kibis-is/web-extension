import { encode as encodeBase64 } from '@stablelib/base64';
import I18next, { type i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';

// apps
import App from '@external/apps/WebAuthnCreateApp';

// constants
import { WEB_AUTHN_REQUEST_TIMEOUT } from '@extension/constants';

// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// errors
import { UnknownError } from '@extension/errors';

// messages
import {
  WebAuthnCreateRequestMessage,
  WebAuthnCreateResponseMessage,
  WebAuthnGetRequestMessage,
  WebAuthnGetResponseMessage,
} from '@common/messages';

// translations
import { en } from '@extension/translations';

// types
import type {
  IBaseOptions,
  ILogger,
  ISerializedPublicKeyCredentialCreationOptions,
  ISerializedPublicKeyCredentialRequestOptions,
} from '@common/types';
import type { INewOptions } from './types';

// utils
import bufferSourceToUint8Array from '@common/utils/bufferSourceToUint8Array';
import createClientInformation from '@common/utils/createClientInformation';
import { randomString } from '@stablelib/random';

export default class WebAuthnInterceptor {
  // private variables
  private _i18next: i18n | null;
  private readonly _rootElementID: string = `kibisis_${randomString(8)}`;
  private readonly _logger: ILogger | null;
  private readonly _navigatorCredentialsCreateFn: typeof navigator.credentials.create;

  constructor({ logger, navigatorCredentialsCreateFn }: INewOptions) {
    this._i18next = null;
    this._logger = logger || null;
    this._navigatorCredentialsCreateFn = navigatorCredentialsCreateFn;
  }

  /**
   * private methods
   */

  private async _dispatchMessageWithTimeout<
    Message extends WebAuthnCreateRequestMessage | WebAuthnGetRequestMessage
  >(
    message: Message,
    responseReference: WebAuthnMessageReferenceEnum
  ): Promise<PublicKeyCredential | null> {
    return new Promise((resolve, reject) => {
      const _functionName = '_dispatchMessage';
      const listener = (event: CustomEvent<string>) => {
        let detail: WebAuthnCreateResponseMessage | WebAuthnGetResponseMessage;

        try {
          detail = JSON.parse(event.detail); // the event.detail should be a stringified object
        } catch (error) {
          this._logger?.debug(
            `${WebAuthnInterceptor.name}#${_functionName}:`,
            error
          );

          // clear the timeout and remove the listener - we failed to parse the message
          window.clearTimeout(timerId);
          window.removeEventListener(responseReference, listener);

          return reject(new UnknownError(error.message));
        }

        // if the request ids or the references do not match ignore - the message may be still coming
        if (
          detail.requestID !== message.id ||
          detail.reference !== responseReference
        ) {
          return;
        }

        // clear the timeout and remove the listener - we can handle it from here
        window.clearTimeout(timerId);
        window.removeEventListener(responseReference, listener);

        // if there was an error return it
        if (detail.error) {
          return reject(detail.error);
        }

        this._logger?.debug(
          `${WebAuthnInterceptor.name}#${_functionName}: received response "${detail.reference}" for request "${detail.requestID}"`
        );

        // return the result
        return resolve(detail.result);
      };
      const timerId = window.setTimeout(() => {
        // remove the listener
        window.removeEventListener(responseReference, listener);

        reject(new UnknownError(`no response from provider`));
      }, WEB_AUTHN_REQUEST_TIMEOUT);

      // listen for the response
      window.addEventListener(responseReference, listener);

      // dispatch the request message
      window.dispatchEvent(
        new CustomEvent(message.reference, {
          detail: message,
        })
      );

      this._logger?.debug(
        `${WebAuthnInterceptor.name}#${_functionName}: posted webauthn request message "${message.reference}" with id "${message.id}"`
      );
    });
  }

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

  /**
   * Convenience function that serializes the public key creation credentials, converting any raw bytes to base64
   * encoded strings to allow to posting to the extension.
   * @param {PublicKeyCredentialCreationOptions} options - The public key creation options to serialize.
   * @returns {ISerializedPublicKeyCredentialCreationOptions} The serialized public key creation options.
   * @private
   */
  private static _serializePublicKeyCreationOptions({
    challenge,
    excludeCredentials,
    user,
    ...otherOptions
  }: PublicKeyCredentialCreationOptions): ISerializedPublicKeyCredentialCreationOptions {
    return {
      ...otherOptions,
      challenge: encodeBase64(bufferSourceToUint8Array(challenge)),
      user: {
        ...user,
        id: encodeBase64(bufferSourceToUint8Array(user.id)),
      },
      ...(excludeCredentials && {
        excludeCredentials: excludeCredentials.map(
          ({ id, ...otherExcludeCredentialProps }) => ({
            ...otherExcludeCredentialProps,
            id: encodeBase64(bufferSourceToUint8Array(id)),
          })
        ),
      }),
    };
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
   * Convenience function that serializes the public key request credentials, converting any raw bytes to base64
   * encoded strings to allow to posting to the extension.
   * @param {PublicKeyCredentialCreationOptions} options - The public key request options to serialize.
   * @returns {ISerializedPublicKeyCredentialRequestOptions} The serialized public key creation options.
   * @private
   */
  private static _serializePublicKeyRequestOptions({
    allowCredentials,
    challenge,
    ...otherOptions
  }: PublicKeyCredentialRequestOptions): ISerializedPublicKeyCredentialRequestOptions {
    return {
      ...otherOptions,
      challenge: encodeBase64(bufferSourceToUint8Array(challenge)),
      ...(allowCredentials && {
        allowCredentials: allowCredentials.map(
          ({ id, ...otherAllowCredentialProps }) => ({
            ...otherAllowCredentialProps,
            id: encodeBase64(bufferSourceToUint8Array(id)),
          })
        ),
      }),
    };
  }

  /**
   * public methods
   */

  public async create(
    options?: CredentialCreationOptions
  ): Promise<PublicKeyCredential | null> {
    return new Promise(async (resolve, reject) => {
      const _functionName = 'create';
      let root: Root;

      if (!options?.publicKey) {
        // if (!options?.publicKey?.pubKeyCredParams.find(({ alg }) => alg === -8)) {
        this._logger?.debug(
          `${WebAuthnInterceptor.name}#${_functionName}: public key credentials do not request "-8" (ed25519)"`
        );

        return resolve(this._navigatorCredentialsCreateFn.call(this, options));
      }

      root = this._createAppRoot();

      root.render(
        createElement(App, {
          clientInfo: createClientInformation(),
          i18n: await this._initializeI18n(),
          initialColorMode: 'light', // default to light
          initialFontFamily: 'Nunito',
          navigatorCredentialsCreateFn: this._navigatorCredentialsCreateFn,
          onClose: () => root.unmount(),
          onResponse: (response: PublicKeyCredential | null) =>
            resolve(response),
          options,
        })
      );

      // try {
      // return await this._dispatchMessageWithTimeout(
      //   new WebAuthnCreateRequestMessage({
      //     clientInfo: createClientInformation(),
      //     id: uuid(),
      //     options: WebAuthnInterceptor._serializePublicKeyCreationOptions(
      //       options.publicKey
      //     ),
      //   }),
      //   WebAuthnMessageReferenceEnum.CreateResponse
      // );
      // } catch (error) {
      //   this._logger?.error(
      //     `${WebAuthnInterceptor.name}#${_functionName}:`,
      //     error
      //   );
      // }
    });
  }
}
