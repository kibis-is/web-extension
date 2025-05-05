import { generate as generateUUID } from '@agoralabs-sh/uuid';
import {
  decode as decodeBase64,
  encode as encodeBase64,
  encodeURLSafe as encodeBase64URLSafe,
} from '@stablelib/base64';
import { decode as decodeCOBOR } from 'cbor2';

// cryptography
import COSEPublicKey from '@provider/cryptography/COSEPublicKey';

// errors
import {
  DecodingError,
  WebAuthnMalformedAuthenticationRequestError,
  WebAuthnMalformedRegistrationRequestError,
} from '@common/errors';

// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// constants
import { WEB_AUTHN_REQUEST_TIMEOUT } from '@client/constants';
import { COSE_ED25519_ALGORITHM } from '@common/constants';

// messages
import WebAuthnAuthenticateRequestMessage from '@common/messages/WebAuthnAuthenticateRequestMessage';
import WebAuthnRegisterRequestMessage from '@common/messages/WebAuthnRegisterRequestMessage';

// types
import type { IResult as WebAuthnAuthenticateResponseMessageResult } from '@common/messages/WebAuthnAuthenticateResponseMessage';
import type { IResult as WebAuthnRegisterResponseMessageResult } from '@common/messages/WebAuthnRegisterResponseMessage';
import {
  IBaseOptions,
  ILogger,
  ISerializedAuthenticatorAssertionResponse,
  ISerializedAuthenticatorAttestationResponse,
  ISerializedPublicKeyCredential,
  ISerializedPublicKeyCredentialCreationOptions,
  ISerializedPublicKeyCredentialRequestOptions,
  TReplace,
} from '@common/types';
import { IOptions, IParsedAttestedCredentialData, IParsedAuthenticatorData, IResult } from './types';

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

  /**
   * Parses authenticator data of a `PublicKeyCredential`.
   * @param {Uint8Array} authenticatorData - The raw authenticator data.
   * @returns {IParsedAuthenticatorData} The parsed authenticator data.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API/Authenticator_data}
   * @static
   * @private
   */
  private static _parseAuthenticatorData(authenticatorData: Uint8Array): IParsedAuthenticatorData {
    const rpIdHash = authenticatorData.slice(0, 32);
    const flags = authenticatorData.slice(32, 32 + 1);
    const signCount = authenticatorData.slice(33, 33 + 4);
    let attestedCredentialData: IParsedAttestedCredentialData | null = null;
    let attestationDataView: DataView;
    let credentialIDLength: number;
    let encodedAttestedCredentialData: Uint8Array;

    if (authenticatorData.length > 33) {
      encodedAttestedCredentialData = authenticatorData.slice(33 + 4);
      attestationDataView = new DataView(encodedAttestedCredentialData.buffer);
      credentialIDLength = attestationDataView.getUint16(16);
      attestedCredentialData = {
        aaguid: encodedAttestedCredentialData.slice(0, 16), // first 16-bytes
        credentialID: encodedAttestedCredentialData.slice(16 + 2, 16 + 2 + credentialIDLength), // start after aaguid + credential id length for length of credential id
        credentialIDLength: encodedAttestedCredentialData.slice(16, 16 + 2), // start after aaguid for 2-bytes
        credentialPublicKey: encodedAttestedCredentialData.slice(16 + 2 + credentialIDLength), // start after aaguid + credential id length + credential id
      };
    }

    return {
      attestedCredentialData,
      flags,
      rpIdHash,
      signCount,
    };
  }

  private static _deserializeAssertionCredential(
    credential: ISerializedPublicKeyCredential<ISerializedAuthenticatorAssertionResponse>
  ): TReplace<PublicKeyCredential, 'response', AuthenticatorAssertionResponse> {
    const decodedRawID = decodeBase64(credential.rawId);

    return {
      ...credential,
      getClientExtensionResults: () => ({}),
      id: encodeBase64URLSafe(decodedRawID).replace(/=/g, ''), // remove the padding
      rawId: uint8ArrayToArrayBuffer(decodedRawID),
      response: {
        authenticatorData: uint8ArrayToArrayBuffer(decodeBase64(credential.response.authenticatorData)),
        clientDataJSON: uint8ArrayToArrayBuffer(decodeBase64(credential.response.clientDataJSON)),
        signature: uint8ArrayToArrayBuffer(decodeBase64(credential.response.signature)),
        userHandle: uint8ArrayToArrayBuffer(decodeBase64(credential.response.userHandle)),
      },
    };
  }

  private static _deserializeAttestationCredential(
    credential: ISerializedPublicKeyCredential<ISerializedAuthenticatorAttestationResponse>
  ): TReplace<PublicKeyCredential, 'response', AuthenticatorAttestationResponse> {
    const attestationObject = decodeBase64(credential.response.attestationObject);
    const decodedAttestationObject = decodeCOBOR<Record<string, Uint8Array>>(attestationObject);
    const decodedRawID = decodeBase64(credential.rawId);
    const { attestedCredentialData } = WebAuthnMessageManager._parseAuthenticatorData(
      decodedAttestationObject.authData
    );
    let cosePublicKey: COSEPublicKey;

    if (!attestedCredentialData) {
      throw new DecodingError('failed to decode authenticator attestation credential');
    }

    cosePublicKey = COSEPublicKey.fromCBOR(attestedCredentialData.credentialPublicKey);

    return {
      ...credential,
      getClientExtensionResults: () => ({}),
      id: encodeBase64URLSafe(decodedRawID).replace(/=/g, ''), // remove the padding
      rawId: uint8ArrayToArrayBuffer(decodedRawID),
      response: {
        attestationObject: uint8ArrayToArrayBuffer(attestationObject),
        clientDataJSON: uint8ArrayToArrayBuffer(decodeBase64(credential.response.clientDataJSON)),
        getAuthenticatorData: () => uint8ArrayToArrayBuffer(decodedAttestationObject.authData),
        getPublicKey: () => null,
        getPublicKeyAlgorithm: () => cosePublicKey.algorithm(),
        getTransports: () => ['hybrid', 'internal'],
      },
    };
  }

  /**
   * Serializes the public key creation credentials, converting any raw bytes to base64 encoded strings to allow to
   * post to the extension.
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
        excludeCredentials: excludeCredentials.map(({ id, ...otherExcludeCredentialProps }) => ({
          ...otherExcludeCredentialProps,
          id: encodeBase64(bufferSourceToUint8Array(id)),
        })),
      }),
    };
  }

  /**
   * Serializes the public key creation credentials, converting any raw bytes to base64 encoded strings to allow to
   * post to the extension.
   * @param {PublicKeyCredentialRequestOptions} options - The public key request options to serialize.
   * @returns {ISerializedPublicKeyCredentialRequestOptions} The serialized public key request options.
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
        allowCredentials: allowCredentials.map(({ id, ...otherAllowCredentialProps }) => ({
          ...otherAllowCredentialProps,
          id: encodeBase64(bufferSourceToUint8Array(id)),
        })),
      }),
    };
  }

  /**
   * public functions
   */

  public async register({
    clientInfo,
    publicKeyOptions,
  }: IOptions<PublicKeyCredentialCreationOptions>): Promise<IResult | null> {
    let result: WebAuthnRegisterResponseMessageResult | null;

    if (!publicKeyOptions) {
      throw new WebAuthnMalformedRegistrationRequestError('no public key creation options supplied');
    }

    result = await dispatchMessageWithTimeout<WebAuthnRegisterResponseMessageResult, WebAuthnRegisterRequestMessage>({
      delay: WEB_AUTHN_REQUEST_TIMEOUT,
      message: new WebAuthnRegisterRequestMessage({
        id: generateUUID(),
        payload: {
          clientInfo,
          options: WebAuthnMessageManager._serializePublicKeyCreationOptions(publicKeyOptions),
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
      credential: WebAuthnMessageManager._deserializeAttestationCredential(result.credential),
    };
  }

  public async authenticate({
    clientInfo,
    publicKeyOptions,
  }: IOptions<PublicKeyCredentialRequestOptions>): Promise<IResult | null> {
    let result: WebAuthnAuthenticateResponseMessageResult | null;

    if (!publicKeyOptions) {
      throw new WebAuthnMalformedAuthenticationRequestError('no public key creation options supplied');
    }

    result = await dispatchMessageWithTimeout<
      WebAuthnAuthenticateResponseMessageResult,
      WebAuthnAuthenticateRequestMessage
    >({
      delay: WEB_AUTHN_REQUEST_TIMEOUT,
      message: new WebAuthnAuthenticateRequestMessage({
        id: generateUUID(),
        payload: {
          clientInfo,
          options: WebAuthnMessageManager._serializePublicKeyRequestOptions(publicKeyOptions),
        },
        reference: WebAuthnMessageReferenceEnum.AuthenticateRequest,
      }),
      responseReference: WebAuthnMessageReferenceEnum.AuthenticateResponse,
      ...(this._logger && { logger: this._logger }),
    });

    if (!result) {
      return null;
    }

    return {
      account: result.account,
      credential: WebAuthnMessageManager._deserializeAssertionCredential(result.credential),
    };
  }
}
