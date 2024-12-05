import {
  decode as decodeBase64,
  encode as encodeBase64,
  encodeURLSafe as encodeBase64URLSafe,
} from '@stablelib/base64';
import { encode as encodeCBOR } from '@stablelib/cbor';
import { hash as hashSHA256 } from '@stablelib/sha256';
import { encode as encodeUTF8 } from '@stablelib/utf8';
import { sign } from 'tweetnacl';

// constants
import { COSE_ED21559_ALGORITHM } from '@common/constants';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';
import UUID from '@extension/models/UUID';

// types
import type { ISerializedPublicKeyCredentialWithAuthenticatorAttestationResponse } from '@common/types';
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
        alg: COSE_ED21559_ALGORITHM,
        createdAt: new Date().getTime().toString(10),
        id: new UUID().toString(),
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
    const coseKey = new Map<number, number | Uint8Array>([
      [1, 1], // key type: okp (Octet Key Pair)
      [3, COSE_ED21559_ALGORITHM], // algorithm: eddsa
      [-1, 6], // curve: ed25519
      [-2, this._keyPair.publicKey], // public key bytes
    ]);

    return encodeCBOR(Object.fromEntries(coseKey));
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
    const decodedCredentialID = new UUID(this._passkey.id).toBytes();
    const credentialIDLength = new Uint8Array([
      (decodedCredentialID.length >> 8) & 0xff, // high byte
      decodedCredentialID.length & 0xff, // low byte
    ]);
    const flags = 0x41; // user present and attestation flag
    const rpIDHash = hashSHA256(encodeUTF8(this._passkey.rp.id));
    const signCount = new Uint8Array(4); // default to zero
    const attestedCredentialData = new Uint8Array([
      ...new UUID(__PROVIDER_ID__).toBytes(), // use the provider identifier as the aaguid
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

  public serializedAttestationCredential(): ISerializedPublicKeyCredentialWithAuthenticatorAttestationResponse {
    const authenticatorData = this.authenticatorData();
    const clientDataJSON = encodeUTF8(
      JSON.stringify({
        type: 'webauthn.create',
        challenge: encodeBase64URLSafe(decodeBase64(this._challenge)), // convert the base64 encoded challenge to url safe
        origin: this._passkey.origin,
      })
    );
    const signature = sign(
      new Uint8Array([
        ...authenticatorData,
        ...hashSHA256(clientDataJSON), // include the hash of the client json
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
      rawId: encodeBase64(new UUID(this._passkey.id).toBytes()),
      response: {
        attestationObject: encodeBase64(attestationObject),
        clientDataJSON: encodeBase64(clientDataJSON),
      },
      type: 'public-key',
    };
  }
}
