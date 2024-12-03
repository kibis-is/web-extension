import {
  decode as decodeBase64,
  encode as encodeBase64,
  encodeURLSafe as encodeBase64URLSafe,
} from '@stablelib/base64';
import { hash as hashSHA256 } from '@stablelib/sha256';
import { encode as encodeUTF8 } from '@stablelib/utf8';
import { randomBytes, sign } from 'tweetnacl';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// types
import type { ISerializedPublicKeyCredentialWithAuthenticatorAttestationResponse } from '@common/types';
import type { IAccountPasskey } from '@extension/types';
import type { IGenerateOptions, IInitOptions, INewOptions } from './types';

export default class PublicKeyCredentialFactory {
  // public variables
  public readonly _challenge: Uint8Array;
  public readonly _keyPair: Ed21559KeyPair;
  public readonly _passkey: IAccountPasskey;

  private constructor({ challenge, keyPair, passkey }: INewOptions) {
    this._challenge = challenge;
    this._passkey = passkey;
    this._keyPair = keyPair;
  }

  /**
   * public static functions
   */

  public static generate({
    challenge,
    keyPair,
    origin,
    rp,
    user,
  }: IGenerateOptions): PublicKeyCredentialFactory {
    return new PublicKeyCredentialFactory({
      challenge,
      keyPair,
      passkey: {
        alg: -8,
        createdAt: new Date().getTime().toString(10),
        id: encodeBase64(randomBytes(32)),
        lastUsedAt: new Date().getTime().toString(10),
        origin,
        rp: {
          id: rp.id || origin,
          name: rp.name,
        },
        user: {
          displayName: user.displayName,
          id: encodeBase64(user.id),
          name: user.name,
        },
      },
    });
  }

  public static init({
    challenge,
    keyPair,
    passkey,
  }: IInitOptions): PublicKeyCredentialFactory {
    return new PublicKeyCredentialFactory({
      challenge,
      keyPair,
      passkey,
    });
  }

  /**
   * private functions
   */

  private _authenticatorData(): Uint8Array {
    const attestedCredentialData = new Uint8Array([...this._keyPair.publicKey]);
    const flags = 0x41;
    const rpIDHash = hashSHA256(encodeUTF8(this._passkey.rp.id));
    const signCount = new Uint8Array(4); // default to zero

    return new Uint8Array([
      ...rpIDHash,
      flags,
      ...signCount,
      ...attestedCredentialData,
    ]);
  }

  /**
   * public functions
   */

  public attestationCredential(): ISerializedPublicKeyCredentialWithAuthenticatorAttestationResponse {
    const authenticatorData = this._authenticatorData();
    const clientDataJSON = JSON.stringify({
      type: 'webauthn.create',
      challenge: encodeBase64URLSafe(this._challenge),
      origin: this._passkey.origin,
    });
    const signature = sign(authenticatorData, this._keyPair.getSecretKey());

    return {
      authenticatorAttachment: 'platform',
      id: encodeBase64URLSafe(decodeBase64(this._passkey.id)),
      response: {
        attestationObject: {
          attStmt: {
            sig: encodeBase64(signature),
          },
          authData: encodeBase64(authenticatorData),
          fmt: 'none',
        },
        clientDataJSON,
      },
      type: 'public-key',
    };
  }

  public passkey(): IAccountPasskey {
    return this._passkey;
  }
}
