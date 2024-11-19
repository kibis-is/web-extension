import { randomBytes } from 'tweetnacl';

// errors
import {
  PasskeyCreationError,
  PasskeyNotSupportedError,
} from '@extension/errors';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// types
import type { IAccountPasskey } from '@extension/types';
import type { ICreatePasskeyOptions } from './types';

export default class PasskeyManager {
  /**
   * public static functions
   */

  /**
   * Registers a passkey with the authenticator and returns the public of an Ed25519 algorithm that can be used to
   * create an account.
   *
   * **NOTE:** This requires the key to support the Ed25519 algorithm.
   * @param {ICreatePasskeyOptions} options - the device ID and an optional logger.
   * @returns {Promise<IAccountPasskey>} a promise that resolves to a created passkey credential.
   * @throws {PasskeyCreationError} if the public key credentials failed to be created on the authenticator.
   * @throws {PasskeyNotSupportedError} if the browser does not support WebAuthn or the authenticator does not support
   * the PRF extension.
   * @public
   * @static
   */
  public static async createPasskeyAccount({
    deviceID,
    name,
    logger,
  }: ICreatePasskeyOptions): Promise<IAccountPasskey> {
    const _functionName = 'createPasskeyAccount';
    const _name = name && name.length > 0 ? name : 'Kibisis Web Extension';
    let _error: string;
    let algorithm: number;
    let credential: PublicKeyCredential | null;
    let publicKey: ArrayBuffer | null;

    try {
      credential = (await navigator.credentials.create({
        publicKey: {
          authenticatorSelection: {
            residentKey: 'required', // make passkey discoverable on the device
            userVerification: 'discouraged',
          },
          challenge: randomBytes(32),
          pubKeyCredParams: [
            { alg: -8, type: 'public-key' }, // ed25519
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

    publicKey = (
      credential.response as AuthenticatorAttestationResponse
    ).getPublicKey();

    if (!publicKey) {
      _error = 'failed to create a passkey - no public key returned';

      logger?.error(`${PasskeyManager.name}#${_functionName}: ${_error}`);

      throw new PasskeyCreationError(_error);
    }

    algorithm = (
      credential.response as AuthenticatorAttestationResponse
    ).getPublicKeyAlgorithm();

    // if it is not an ed25519 algorithm it is not supported
    if (algorithm != -8) {
      _error = `failed to create a passkey, expected the an ed25519 algorithm "8" but received "${algorithm}"`;

      logger?.error(`${PasskeyManager.name}#${_functionName}: ${_error}`);

      throw new PasskeyNotSupportedError(_error);
    }

    return {
      algorithm,
      id: AccountRepository.encode(new Uint8Array(credential.rawId)),
      name: _name,
      publicKey: AccountRepository.encode(new Uint8Array(publicKey)),
      transports: (
        credential.response as AuthenticatorAttestationResponse
      ).getTransports() as AuthenticatorTransport[],
      userID: deviceID,
    };
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
