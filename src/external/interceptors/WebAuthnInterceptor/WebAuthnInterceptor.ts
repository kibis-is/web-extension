import { encode as encodeBase64 } from '@stablelib/base64';
import { v4 as uuid } from 'uuid';

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

// types
import type {
  ILogger,
  ISerializedPublicKeyCredentialCreationOptions,
  ISerializedPublicKeyCredentialRequestOptions,
} from '@common/types';
import type { INewOptions } from './types';

// utils
import bufferSourceToUint8Array from '@common/utils/bufferSourceToUint8Array';
import createClientInformation from '@common/utils/createClientInformation';

export default class WebAuthnInterceptor {
  // private variables
  private readonly _credentialsContainer: CredentialsContainer;
  private readonly _logger: ILogger | null;

  constructor({ credentialsContainer, logger }: INewOptions) {
    this._credentialsContainer = credentialsContainer;
    this._logger = logger || null;
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

  public async get(
    originalFn: typeof navigator.credentials.get,
    options?: CredentialRequestOptions
  ): Promise<Credential | null> {
    return originalFn.call(this._credentialsContainer, options);
  }

  public async create(
    originalFn: typeof navigator.credentials.create,
    options?: CredentialCreationOptions
  ): Promise<PublicKeyCredential | null> {
    const _functionName = 'create';

    // if the credentials contain a request for an ed25519 public key, invoke kibisis
    // if (!!options?.publicKey?.pubKeyCredParams.find(({ alg }) => alg === -8)) {
    if (options?.publicKey) {
      this._logger?.debug(
        `${WebAuthnInterceptor.name}#${_functionName}: found ed25519 public key request`
      );

      try {
        return await this._dispatchMessageWithTimeout(
          new WebAuthnCreateRequestMessage({
            clientInfo: createClientInformation(),
            id: uuid(),
            options: WebAuthnInterceptor._serializePublicKeyCreationOptions(
              options.publicKey
            ),
          }),
          WebAuthnMessageReferenceEnum.CreateResponse
        );
      } catch (error) {
        this._logger?.error(
          `${WebAuthnInterceptor.name}#${_functionName}:`,
          error
        );
      }
    }

    // call the original function
    return originalFn.call(this._credentialsContainer, options);
  }
}
