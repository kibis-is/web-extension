import {
  decode as decodeUUID,
  generate as generateUUID,
} from '@agoralabs-sh/uuid';
import { sha256 } from '@noble/hashes/sha256';
import {
  decode as decodeBase64,
  encode as encodeBase64,
  encodeURLSafe as encodeBase64URLSafe,
} from '@stablelib/base64';
import { encode as encodeCBOR } from '@stablelib/cbor';
import { encode as encodeUTF8 } from '@stablelib/utf8';

// constants
import {
  COSE_ED25519_ALGORITHM,
  COSE_ES256_ALGORITHM,
} from '@common/constants';

// cryptography
import Ed21559KeyPair from '@extension/cryptography/Ed21559KeyPair';
import ES256KeyPair from '@extension/cryptography/ES256KeyPair';

// types
import type {
  ISerializedAuthenticatorAssertionResponse,
  ISerializedAuthenticatorAttestationResponse,
  ISerializedPublicKeyCredential,
} from '@common/types';
import type { IAccountPasskey } from '@extension/types';
import type { IGenerateOptions, IInitOptions, INewOptions } from './types';

export default class PublicKeyCredentialFactory {
  // private variables
  private readonly _challenge: string;
  private readonly _keyPair: Ed21559KeyPair | ES256KeyPair;
  private readonly _passkey: IAccountPasskey;

  private constructor({ challenge, keyPair, passkey }: INewOptions) {
    this._challenge = challenge;
    this._passkey = passkey;
    this._keyPair = keyPair;
  }

  /**
   * public static functions
   */

  public static generate({
    origin,
    privateKey,
    publicKeyCreationOptions,
  }: IGenerateOptions): PublicKeyCredentialFactory {
    const coseAlgorithm = publicKeyCreationOptions.pubKeyCredParams.reduce(
      (acc, value) => {
        // ed21559 is preferred
        if (acc === COSE_ED25519_ALGORITHM) {
          return acc;
        }

        return value.alg === COSE_ED25519_ALGORITHM ||
          value.alg === COSE_ES256_ALGORITHM
          ? value.alg
          : acc;
      },
      null
    ); // get the cose algorithm type
    let keyPair: Ed21559KeyPair | ES256KeyPair;

    switch (coseAlgorithm) {
      case COSE_ES256_ALGORITHM:
        keyPair = ES256KeyPair.generateFromPrivateKey(privateKey);
        break;
      case COSE_ED25519_ALGORITHM:
      default:
        keyPair = Ed21559KeyPair.generateFromPrivateKey(privateKey);
        break;
    }

    return new PublicKeyCredentialFactory({
      challenge: publicKeyCreationOptions.challenge,
      keyPair,
      passkey: {
        alg: keyPair.coseAlgorithm(),
        createdAt: new Date().getTime().toString(10),
        id: generateUUID(),
        lastUsedAt: new Date().getTime().toString(10),
        origin,
        rp: {
          ...publicKeyCreationOptions.rp,
          id: publicKeyCreationOptions.rp.id || origin,
        },
        user: publicKeyCreationOptions.user,
      },
    });
  }

  public static init({
    passkey,
    privateKey,
    publicKeyCredentialRequestOptions,
  }: IInitOptions): PublicKeyCredentialFactory {
    let keyPair: Ed21559KeyPair | ES256KeyPair;

    switch (passkey.alg) {
      case COSE_ES256_ALGORITHM:
        keyPair = ES256KeyPair.generateFromPrivateKey(privateKey);
        break;
      case COSE_ED25519_ALGORITHM:
      default:
        keyPair = Ed21559KeyPair.generateFromPrivateKey(privateKey);
        break;
    }

    return new PublicKeyCredentialFactory({
      challenge: publicKeyCredentialRequestOptions.challenge,
      keyPair,
      passkey,
    });
  }

  /**
   * public functions
   */

  /**
   * Creates the authenticated data.
   * @returns {Uint8Array} The authenticated data.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API/Authenticator_data#data_structure}
   * @private
   */
  public authenticatorData(): Uint8Array {
    const decodedCredentialID = decodeUUID(this._passkey.id);
    const credentialIDLength = new Uint8Array([
      (decodedCredentialID.length >> 8) & 0xff, // high byte
      decodedCredentialID.length & 0xff, // low byte
    ]);
    const flags = 0x41; // user present and attestation flag
    const rpIDHash = sha256(encodeUTF8(this._passkey.rp.id));
    const signCount = new Uint8Array(4); // default to zero
    const attestedCredentialData = new Uint8Array([
      ...decodeUUID(__PROVIDER_ID__), // use the provider identifier as the aaguid
      ...credentialIDLength,
      ...decodedCredentialID,
      ...this._keyPair.coseEncodedKey(),
    ]);

    return new Uint8Array([
      ...rpIDHash,
      flags,
      ...signCount,
      ...attestedCredentialData,
    ]);
  }

  public passkey(): IAccountPasskey {
    return this._passkey;
  }

  public serializedAssertionCredential(): ISerializedPublicKeyCredential<ISerializedAuthenticatorAssertionResponse> {
    const authenticatorData = this.authenticatorData();
    const clientDataJSON = encodeUTF8(
      JSON.stringify({
        type: 'webauthn.get',
        challenge: encodeBase64URLSafe(decodeBase64(this._challenge)), // convert the base64 encoded challenge to url safe
        origin: this._passkey.origin,
      })
    );
    const signature = this._keyPair.sign(
      new Uint8Array([
        ...authenticatorData,
        ...sha256(clientDataJSON), // include the hash of the client json
      ])
    );

    return {
      authenticatorAttachment: 'platform',
      rawId: encodeBase64(decodeUUID(this._passkey.id)),
      response: {
        authenticatorData: encodeBase64(authenticatorData),
        clientDataJSON: encodeBase64(clientDataJSON),
        signature: encodeBase64(signature),
        userHandle: encodeBase64(encodeUTF8(this._passkey.user.id)),
      },
      type: 'public-key',
    };
  }

  public serializedAttestationCredential(): ISerializedPublicKeyCredential<ISerializedAuthenticatorAttestationResponse> {
    const authenticatorData = this.authenticatorData();
    const clientDataJSON = encodeUTF8(
      JSON.stringify({
        type: 'webauthn.create',
        challenge: encodeBase64URLSafe(decodeBase64(this._challenge)), // convert the base64 encoded challenge to url safe
        origin: this._passkey.origin,
      })
    );
    const signature = this._keyPair.sign(
      new Uint8Array([
        ...authenticatorData,
        ...sha256(clientDataJSON), // include the hash of the client json
      ])
    );
    const attestationObject = encodeCBOR({
      attStmt: {
        alg: this._passkey.alg,
        sig: signature,
      },
      authData: authenticatorData,
      fmt: 'packed',
    });

    return {
      authenticatorAttachment: 'platform',
      rawId: encodeBase64(decodeUUID(this._passkey.id)),
      response: {
        attestationObject: encodeBase64(attestationObject),
        clientDataJSON: encodeBase64(clientDataJSON),
      },
      type: 'public-key',
    };
  }
}
