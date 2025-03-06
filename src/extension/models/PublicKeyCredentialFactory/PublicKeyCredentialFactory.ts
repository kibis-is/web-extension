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
import { sign } from 'tweetnacl';

// constants
import { COSE_ED25519_ALGORITHM } from '@common/constants';

// cryptography
import Ed21559KeyPair from '@extension/cryptography/Ed21559KeyPair';

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
  private readonly _keyPair: Ed21559KeyPair;
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
    keyPair,
    origin,
    publicKeyCreationOptions,
  }: IGenerateOptions): PublicKeyCredentialFactory {
    return new PublicKeyCredentialFactory({
      challenge: publicKeyCreationOptions.challenge,
      keyPair,
      passkey: {
        alg: COSE_ED25519_ALGORITHM,
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
    keyPair,
    passkey,
    publicKeyCredentialRequestOptions,
  }: IInitOptions): PublicKeyCredentialFactory {
    return new PublicKeyCredentialFactory({
      challenge: publicKeyCredentialRequestOptions.challenge,
      keyPair,
      passkey,
    });
  }

  /**
   * private functions
   */

  private _coseEncodedKey(): Uint8Array {
    return encodeCBOR({
      [1]: 1, // key type: okp (octet key pair)
      [3]: COSE_ED25519_ALGORITHM, // algorithm: eddsa
      [-1]: 6, // curve: ed25519
      [-2]: this._keyPair.publicKey, // public key bytes
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
      ...this._coseEncodedKey(),
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
    const signature = sign.detached(
      new Uint8Array([
        ...authenticatorData,
        ...sha256(clientDataJSON), // include the hash of the client json
      ]),
      this._keyPair.getSecretKey()
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
    const signature = sign.detached(
      new Uint8Array([
        ...authenticatorData,
        ...sha256(clientDataJSON), // include the hash of the client json
      ]),
      this._keyPair.getSecretKey()
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
