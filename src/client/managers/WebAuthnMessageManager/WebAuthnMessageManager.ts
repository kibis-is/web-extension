import {
  decode as decodeBase64,
  encode as encodeBase64,
  encodeURLSafe as encodeBase64URLSafe,
} from '@stablelib/base64';
import { decode as decodeCOBOR } from '@stablelib/cbor';
import { v4 as uuid } from 'uuid';

// errors
import { WebAuthnMalformedRegistrationRequestError } from '@common/errors';

// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// constants
import { WEB_AUTHN_REQUEST_TIMEOUT } from '@client/constants';
import { COSE_ED25519_ALGORITHM } from '@common/constants';

// messages
import WebAuthnRegisterRequestMessage from '@common/messages/WebAuthnRegisterRequestMessage';

// types
import type { IResult as WebAuthnRegisterResponseMessageResult } from '@common/messages/WebAuthnRegisterResponseMessage';
import {
  IBaseOptions,
  ILogger,
  ISerializedPublicKeyCredentialCreationOptions,
  ISerializedPublicKeyCredentialWithAuthenticatorAttestationResponse,
  TReplace,
} from '@common/types';
import type { IRegisterOptions, IRegisterResult } from './types';

// utils
import bufferSourceToUint8Array from '@common/utils/bufferSourceToUint8Array';
import dispatchMessageWithTimeout from '@client/utils/dispatchMessageWithTimeout';
import uint8ArrayToArrayBuffer from '@common/utils/uint8ArrayToArrayBuffer';

export default class WebAuthnMessageManager {
  // private variables
  private readonly _logger: ILogger | null;

  constructor({ logger }: IBaseOptions) {
    this._logger = logger || null;
  }

  /**
   * private functions
   */

  private static _deserializeAttestationCredential(
    credential: ISerializedPublicKeyCredentialWithAuthenticatorAttestationResponse
  ): TReplace<
    PublicKeyCredential,
    'response',
    AuthenticatorAttestationResponse
  > {
    const attestationObject = decodeBase64(
      credential.response.attestationObject
    );
    const decodedAttestationObject = decodeCOBOR(attestationObject);
    const decodedRawID = decodeBase64(credential.rawId);

    return {
      ...credential,
      getClientExtensionResults: () => ({}),
      id: encodeBase64URLSafe(decodedRawID).replace(/=/g, ''), // remove the padding
      rawId: uint8ArrayToArrayBuffer(decodedRawID),
      response: {
        attestationObject: uint8ArrayToArrayBuffer(attestationObject),
        clientDataJSON: uint8ArrayToArrayBuffer(
          decodeBase64(credential.response.clientDataJSON)
        ),
        getAuthenticatorData: () =>
          uint8ArrayToArrayBuffer(decodedAttestationObject.authData),
        getPublicKey: () => null,
        getPublicKeyAlgorithm: () => COSE_ED25519_ALGORITHM,
        getTransports: () => ['internal'],
      },
    };
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

    return {
      account: result.account,
      credential: WebAuthnMessageManager._deserializeAttestationCredential(
        result.credential
      ),
    };
  }
}
