import { encode as encodeBase64 } from '@stablelib/base64';
import { v4 as uuid } from 'uuid';

// errors
import { WebAuthnMalformedRegistrationRequestError } from '@common/errors';

// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// constants
import { WEB_AUTHN_REQUEST_TIMEOUT } from '@client/constants';

// messages
import WebAuthnRegisterRequestMessage from '@common/messages/WebAuthnRegisterRequestMessage';

// types
import type { IResult as WebAuthnRegisterResponseMessageResult } from '@common/messages/WebAuthnRegisterResponseMessage';
import type {
  IBaseOptions,
  ILogger,
  ISerializedPublicKeyCredentialCreationOptions,
} from '@common/types';
import type { IRegisterOptions, IRegisterResult } from './types';

// utils
import bufferSourceToUint8Array from '@common/utils/bufferSourceToUint8Array';
import dispatchMessageWithTimeout from '@client/utils/dispatchMessageWithTimeout';

export default class WebAuthnMessageManager {
  // private variables
  private readonly _logger: ILogger | null;

  constructor({ logger }: IBaseOptions) {
    this._logger = logger || null;
  }

  /**
   * private functions
   */

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
   * public functions
   */

  public async register({
    clientInfo,
    publicKeyCreationOptions,
  }: IRegisterOptions): Promise<IRegisterResult | null> {
    let result: WebAuthnRegisterResponseMessageResult | null;

    if (!publicKeyCreationOptions) {
      throw new WebAuthnMalformedRegistrationRequestError(
        'no public key creation options supplied'
      );
    }

    result = await dispatchMessageWithTimeout<
      WebAuthnRegisterResponseMessageResult,
      WebAuthnRegisterRequestMessage
    >({
      delay: WEB_AUTHN_REQUEST_TIMEOUT,
      message: new WebAuthnRegisterRequestMessage({
        id: uuid(),
        payload: {
          clientInfo,
          options: WebAuthnMessageManager._serializePublicKeyCreationOptions(
            publicKeyCreationOptions
          ),
        },
        reference: WebAuthnMessageReferenceEnum.RegisterRequest,
      }),
      responseReference: WebAuthnMessageReferenceEnum.RegisterResponse,
      ...(this._logger && { logger: this._logger }),
    });

    if (!result) {
      return null;
    }

    // TODO: convert serialized public key credential
    return {
      account: result.account,
      credential: new PublicKeyCredential(),
    };
  }
}
