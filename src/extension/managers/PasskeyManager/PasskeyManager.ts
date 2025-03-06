import { decode as decodeHex } from '@stablelib/hex';
import { randomBytes } from 'tweetnacl';

// constants
import {
  CHALLENGE_BYTE_SIZE,
  DERIVATION_KEY_ALGORITHM,
  DERIVATION_KEY_HASH_ALGORITHM,
  ENCRYPTION_KEY_ALGORITHM,
  ENCRYPTION_KEY_BIT_SIZE,
  INITIALIZATION_VECTOR_BYTE_SIZE,
  SALT_BYTE_SIZE,
} from './constants';

// errors
import {
  PasskeyCreationError,
  PasskeyNotSupportedError,
  UnableToFetchPasskeyError,
} from '@common/errors';

// repositories
import PasskeyCredentialRepository from '@extension/repositories/PasskeyCredentialRepository';

// types
import type { IAuthenticationExtensionsClientOutputs } from '@common/types';
import type { IPasskeyCredential } from '@extension/types';
import type {
  ICreatePasskeyCredentialOptions,
  IDecryptBytesOptions,
  IEncryptBytesOptions,
  IFetchPasskeyKeyMaterialOptions,
  IGenerateEncryptionKeyOptions,
} from './types';

export default class PasskeyManager {
  /**
   * private static functions
   */

  /**
   * Generates an encryption key that can be used to decrypt/encrypt bytes. This function imports the key using the
   * input key material rom the passkey.
   * @param {IGenerateEncryptionKeyOptions} options - the user ID and the input key material from the passkey.
   * @returns {Promise<CryptoKey>} a promise that resolves to an encryption key that can be used to decrypt/encrypt
   * some bytes.
   * @private
   * @static
   */
  private static async _generateEncryptionKeyFromInputKeyMaterial({
    inputKeyMaterial,
    userID,
  }: IGenerateEncryptionKeyOptions): Promise<CryptoKey> {
    const derivationKey = await crypto.subtle.importKey(
      'raw',
      inputKeyMaterial,
      DERIVATION_KEY_ALGORITHM,
      false,
      ['deriveKey']
    );

    return await crypto.subtle.deriveKey(
      {
        name: DERIVATION_KEY_ALGORITHM,
        info: new TextEncoder().encode(userID),
        salt: new Uint8Array(), // use an empty salt
        hash: DERIVATION_KEY_HASH_ALGORITHM,
      },
      derivationKey,
      {
        name: ENCRYPTION_KEY_ALGORITHM,
        length: ENCRYPTION_KEY_BIT_SIZE,
      },
      false,
      ['decrypt', 'encrypt']
    );
  }

  /**
   * public static functions
   */

  /**
   * Registers a passkey with the authenticator and returns the credentials that are used to fetch the key material to derive an
   * encryption key. NOTE: this requires PRF extension support and will throw an error if the authenticator does not
   * support it.
   * @param {ICreatePasskeyOptions} options - the device ID and an optional logger.
   * @returns {Promise<IPasskeyCredential>} a promise that resolves to a created passkey credential.
   * @throws {PasskeyCreationError} if the public key credentials failed to be created on the authenticator.
   * @throws {PasskeyNotSupportedError} if the browser does not support WebAuthn or the authenticator does not support
   * the PRF extension.
   * @public
   * @static
   */
  public static async createPasskeyCredential({
    deviceID,
    name,
    logger,
  }: ICreatePasskeyCredentialOptions): Promise<IPasskeyCredential> {
    const _functionName = 'createPasskeyCredential';
    const _name = name && name.length > 0 ? name : 'Kibisis Web Extension';
    const salt = randomBytes(SALT_BYTE_SIZE);
    let _error: string;
    let credential: PublicKeyCredential | null;
    let extensionResults: IAuthenticationExtensionsClientOutputs;
    let publicKey: ArrayBuffer | null;

    try {
      credential = (await navigator.credentials.create({
        publicKey: {
          authenticatorSelection: {
            residentKey: 'required', // make passkey discoverable on the device
            userVerification: 'discouraged',
          },
          challenge: randomBytes(32),
          extensions: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            prf: {
              eval: {
                first: salt,
              },
            },
          },
          pubKeyCredParams: [
            { alg: -8, type: 'public-key' }, // Ed25519
            { alg: -7, type: 'public-key' }, // ES256
            { alg: -257, type: 'public-key' }, // RS256
          ],
          rp: {
            name: _name,
          },
          user: {
            id: new TextEncoder().encode(deviceID),
            name: deviceID,
            displayName: deviceID,
          },
        },
      })) as PublicKeyCredential | null;
    } catch (error) {
      logger?.error(`${PasskeyManager.name}#${_functionName}:`, error);

      throw new PasskeyCreationError(error.message);
    }

    if (!credential) {
      _error = 'failed to create a passkey';

      logger?.error(`${PasskeyManager.name}#${_functionName}: ${_error}`);

      throw new PasskeyCreationError(_error);
    }

    extensionResults = credential.getClientExtensionResults();

    // if the prf is not present or the not enabled, the browser does not support the prf extension
    if (!extensionResults.prf?.enabled) {
      _error = 'authenticator does not support the prf extension for webauthn';

      logger?.error(`${PasskeyManager.name}#${_functionName}: ${_error}`);

      throw new PasskeyNotSupportedError(_error);
    }

    publicKey = (
      credential.response as AuthenticatorAttestationResponse
    ).getPublicKey();

    return {
      algorithm: (
        credential.response as AuthenticatorAttestationResponse
      ).getPublicKeyAlgorithm(),
      id: PasskeyCredentialRepository.encode(new Uint8Array(credential.rawId)),
      initializationVector: PasskeyCredentialRepository.encode(
        randomBytes(INITIALIZATION_VECTOR_BYTE_SIZE)
      ),
      name: _name,
      publicKey: publicKey
        ? PasskeyCredentialRepository.encode(new Uint8Array(publicKey))
        : null,
      salt: PasskeyCredentialRepository.encode(salt),
      transports: (
        credential.response as AuthenticatorAttestationResponse
      ).getTransports() as AuthenticatorTransport[],
      userID: deviceID,
    };
  }

  /**
   * Decrypts some previously encrypted bytes using the input key material fetched from a passkey.
   * @param {IDecryptBytesOptions} options - the encrypted bytes, the passkey credentials and the input key material
   * fetched from the passkey.
   * @returns {Promise<Uint8Array>} a promise that resolves to the decrypted bytes.
   * @public
   * @static
   */
  public static async decryptBytes({
    encryptedBytes,
    inputKeyMaterial,
    passkey,
  }: IDecryptBytesOptions): Promise<Uint8Array> {
    const encryptionKey =
      await PasskeyManager._generateEncryptionKeyFromInputKeyMaterial({
        inputKeyMaterial,
        userID: passkey.userID,
      });
    const decryptedBytes = await crypto.subtle.decrypt(
      {
        name: ENCRYPTION_KEY_ALGORITHM,
        iv: PasskeyCredentialRepository.decode(passkey.initializationVector),
      },
      encryptionKey,
      encryptedBytes
    );

    return new Uint8Array(decryptedBytes);
  }

  /**
   * Encrypts some arbitrary bytes using the input key material fetched from a passkey. This function uses the AES-GCM
   * algorithm to encrypt the bytes.
   * @param {IEncryptBytesOptions} options - the bytes to encrypt, the initialization vector created at the passkey
   * creation, the device ID and the input key material fetched from the passkey.
   * @returns {Promise<Uint8Array>} a promise that resolves to the encrypted bytes.
   * @public
   * @static
   */
  public static async encryptBytes({
    bytes,
    inputKeyMaterial,
    passkey,
  }: IEncryptBytesOptions): Promise<Uint8Array> {
    const encryptionKey =
      await PasskeyManager._generateEncryptionKeyFromInputKeyMaterial({
        inputKeyMaterial,
        userID: passkey.userID,
      });
    const encryptedBytes = await crypto.subtle.encrypt(
      {
        name: ENCRYPTION_KEY_ALGORITHM,
        iv: PasskeyCredentialRepository.decode(passkey.initializationVector),
      },
      encryptionKey,
      bytes
    );

    return new Uint8Array(encryptedBytes);
  }

  /**
   * Fetches the key material from the authenticator that is used to derive the encryption key.
   * @param {IFetchPasskeyKeyMaterialOptions} options - passkey credentials and a logger.
   * @returns {Promise<Uint8Array>} a promise that resolves to the key material used to derive an encryption key.
   * @throws {UnableToFetchPasskeyError} if the authenticator did not return the public key credentials.
   * @throws {PasskeyNotSupportedError} if the browser does not support WebAuthn or the authenticator does not support
   * the PRF extension.
   * @public
   * @static
   */
  public static async fetchInputKeyMaterialFromPasskey({
    credential,
    logger,
  }: IFetchPasskeyKeyMaterialOptions): Promise<Uint8Array> {
    const _functionName = 'fetchPasskey';
    let _error: string;
    let _credential: PublicKeyCredential | null;
    let extensionResults: IAuthenticationExtensionsClientOutputs;

    try {
      _credential = (await navigator.credentials.get({
        publicKey: {
          allowCredentials: [
            {
              id: decodeHex(credential.id),
              transports: credential.transports,
              type: 'public-key',
            },
          ],
          challenge: randomBytes(CHALLENGE_BYTE_SIZE),
          extensions: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            prf: {
              eval: {
                first: decodeHex(credential.salt),
              },
            },
          },
          userVerification: 'discouraged',
        },
      })) as PublicKeyCredential | null;
    } catch (error) {
      logger?.error(`${PasskeyManager.name}#${_functionName}:`, error);

      throw new UnableToFetchPasskeyError(credential.id, error.message);
    }

    if (!_credential) {
      _error = `failed to fetch passkey "${credential.id}"`;

      logger?.error(`${PasskeyManager.name}#${_functionName}: ${_error}`);

      throw new UnableToFetchPasskeyError(credential.id, _error);
    }

    extensionResults = _credential.getClientExtensionResults();

    // if the prf is not present or not results, the browser does not support the prf extension
    if (!extensionResults.prf?.results) {
      _error = 'authenticator does not support the prf extension for webauthn';

      logger?.error(`${PasskeyManager.name}#${_functionName}: ${_error}`);

      throw new PasskeyNotSupportedError(_error);
    }

    return new Uint8Array(extensionResults.prf.results.first);
  }

  /**
   * Convenience function that simply checks if the browser supports public key WebAuthn.
   * @returns {boolean} true of the browser supports public key WebAuthn, false otherwise.
   * @public
   * @static
   */
  public static isSupported(): boolean {
    return !!window?.PublicKeyCredential;
  }
}
