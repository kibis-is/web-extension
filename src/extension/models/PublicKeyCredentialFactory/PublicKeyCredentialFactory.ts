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
import { encode as encodeCBOR } from 'cbor2';
import { encode as encodeUTF8 } from '@stablelib/utf8';

// constants
import {
  COSE_ED25519_ALGORITHM,
  COSE_ES256_ALGORITHM,
} from '@common/constants';

// cryptography
import COSEPublicKey from '@extension/cryptography/COSEPublicKey';
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
    let coseAlgorithm = publicKeyCreationOptions.pubKeyCredParams.reduce(
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
        coseAlgorithm = COSE_ES256_ALGORITHM;
        break;
      case COSE_ED25519_ALGORITHM:
      default:
        keyPair = Ed21559KeyPair.generateFromPrivateKey(privateKey);
        coseAlgorithm = COSE_ED25519_ALGORITHM;
        break;
    }

    return new PublicKeyCredentialFactory({
      challenge: publicKeyCreationOptions.challenge,
      keyPair,
      passkey: {
        alg: coseAlgorithm,
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

  public passkey(): IAccountPasskey {
    return this._passkey;
  }

  /**
   * Creates the serialized public key credential with an assertion response that is used in a
   * `navigator.credential.get()` response.
   *
   * **NOTE:** The flag byte is calculated as:
   * * Bit 0 (User Presence, UP): Set to 1 since "userPresent" is true.
   * * Bit 2 (User Verification, UV): Set to 1 since "userVerified" is true.
   * * Bit 3 (Backup Eligibility, BE): Set to 1 since "backupEligibility" is true.
   * * Bit 4 (Backup State, BS): Set to 1 since "backupState" is true.
   * * Bit 6 (Attested Credential Data, AT): Set to 0 since "attestedData" is false.
   * *Bit 7 (Extension Data, ED): Set to 0 since "extensionsIncluded" is false.
   * @returns {ISerializedPublicKeyCredential<ISerializedAuthenticatorAssertionResponse>} A public key credential
   * with an assertion response.
   * @public
   */
  public serializedAssertionCredential(): ISerializedPublicKeyCredential<ISerializedAuthenticatorAssertionResponse> {
    const authenticatorData = new Uint8Array([
      ...sha256(encodeUTF8(this._passkey.rp.id)), // rp hash
      0x1d, // flags
      ...new Uint8Array(4), // sign count
    ]);
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

  /**
   * Creates the serialized public key credential with an attestation response that is used in a
   * `navigator.credential.create()` response.
   *
   * **NOTE:** The flag byte is calculated as:
   * * Bit 0 (User Presence, UP): Set to 1 since "userPresent" is true.
   * * Bit 2 (User Verification, UV): Set to 1 since "userVerified" is true.
   * * Bit 3 (Backup Eligibility, BE): Set to 1 since "backupEligibility" is true.
   * * Bit 4 (Backup State, BS): Set to 0 since "backupState" is false.
   * * Bit 6 (Attested Credential Data, AT): Set to 1 since "attestedData" is true.
   * *Bit 7 (Extension Data, ED): Set to 0 since "extensionsIncluded" is false.
   * @returns {ISerializedPublicKeyCredential<ISerializedAuthenticatorAttestationResponse>} A public key credential
   * with an attestation response.
   * @public
   */
  public serializedAttestationCredential(): ISerializedPublicKeyCredential<ISerializedAuthenticatorAttestationResponse> {
    const cosePublicKey: COSEPublicKey = new COSEPublicKey({
      algorithm: this._passkey.alg,
      publicKey: this._keyPair.publicKey(),
    });
    const decodedCredentialID = decodeUUID(this._passkey.id);
    const credentialIDLength = new Uint8Array([
      (decodedCredentialID.length >> 8) & 0xff, // high byte
      decodedCredentialID.length & 0xff, // low byte
    ]);
    const authenticatorData = new Uint8Array([
      ...sha256(encodeUTF8(this._passkey.rp.id)), // rp hash
      0x4d, // flags
      ...new Uint8Array(4), // sign count
      ...decodeUUID(__PROVIDER_ID__), // aaguid (use the provider identifier)
      ...credentialIDLength, // credential id length
      ...decodedCredentialID, // credential id
      ...cosePublicKey.toCBOR(), // cbor encoded cose public key
    ]);
    const clientDataJSON = encodeUTF8(
      JSON.stringify({
        type: 'webauthn.create',
        challenge: encodeBase64URLSafe(decodeBase64(this._challenge)).replace(
          /=/g,
          ''
        ), // convert the base64 encoded challenge to url safe with padding removed
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
