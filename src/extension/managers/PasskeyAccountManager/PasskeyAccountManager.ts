import { decode as decodeCBOR } from '@stablelib/cbor';
import { encode as encodeUT8 } from '@stablelib/utf8';
import { type EncodedSignedTransaction } from 'algosdk';
import { Buffer } from 'buffer';
import { encode as encodeMsgpack } from 'msgpack-lite';
import { randomBytes } from 'tweetnacl';

// errors
import {
  InvalidAccountTypeError,
  PasskeyCreationError,
  PasskeyNotSupportedError,
  UnableToFetchPasskeyError,
} from '@extension/errors';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// types
import type { IBaseOptions } from '@common/types';
import type { IAttestationCBORObject } from '@extension/types';
import type {
  ICreatePasskeyOptions,
  ICreatePasskeyResult,
  ISignTransactionOptions,
} from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

export default class PasskeyAccountManager {
  /**
   * Extracts the public key from an authenticator attestation response.
   *
   * @param {AuthenticatorAttestationResponse} response - The response object containing the attested credentials.
   * @param {IBaseOptions} options - Options including a logger.
   * @return {Uint8Array | null} The extracted public key as a Uint8Array, or null if extraction fails.
   * @private
   * @static
   */
  private static _extractPublicKeyFromAttestationResponse(
    response: AuthenticatorAttestationResponse,
    options?: IBaseOptions
  ): Uint8Array | null {
    const _functionName = '_extractPublicKeyFromAttestationResponse';
    let decodedAttestationCBORObject: IAttestationCBORObject;
    let publicKey: Uint8Array;

    try {
      decodedAttestationCBORObject = decodeCBOR(
        new Uint8Array(response.attestationObject)
      );
    } catch (error) {
      options &&
        options.logger?.debug(
          `${PasskeyAccountManager.name}#${_functionName}:`,
          error
        );

      return null;
    }

    // extract the key from the attested credential data which is at authData[64:] and is 32 bytes long
    publicKey = decodedAttestationCBORObject.authData.slice(64, 96);

    // ensure the public key is 32 bytes
    if (publicKey.length !== 32) {
      options &&
        options.logger?.debug(
          `${PasskeyAccountManager.name}#${_functionName}: the decoded public key must be 32 bytes but the extracted key is "${publicKey.length}" bytes`
        );

      return null;
    }

    return publicKey;
  }

  /**
   * public static functions
   */

  /**
   * Registers a passkey with the authenticator and returns the public of an Ed25519 algorithm that can be used to
   * create an account.
   *
   * **NOTE:** This requires the key to support the Ed25519 algorithm.
   * @param {ICreatePasskeyOptions} options - The device ID and an optional logger.
   * @returns {Promise<ICreatePasskeyResult>} A promise that resolves to a created passkey account and public key.
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
  }: ICreatePasskeyOptions): Promise<ICreatePasskeyResult> {
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
            userVerification: 'preferred',
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
      logger?.error(`${PasskeyAccountManager.name}#${_functionName}:`, error);

      throw new PasskeyCreationError(error.message);
    }

    if (!credential) {
      _error = 'failed to create a passkey';

      logger?.error(
        `${PasskeyAccountManager.name}#${_functionName}: ${_error}`
      );

      throw new PasskeyCreationError(_error);
    }

    publicKey = PasskeyAccountManager._extractPublicKeyFromAttestationResponse(
      credential.response as AuthenticatorAttestationResponse
    );

    if (!publicKey) {
      _error = 'failed to create a passkey - no public key returned';

      logger?.error(
        `${PasskeyAccountManager.name}#${_functionName}: ${_error}`
      );

      throw new PasskeyCreationError(_error);
    }

    algorithm = (
      credential.response as AuthenticatorAttestationResponse
    ).getPublicKeyAlgorithm();

    // if it is not an ed25519 algorithm it is not supported
    if (algorithm != -8) {
      _error = `failed to create a passkey, expected the an ed25519 algorithm "-8" but received "${algorithm}"`;

      logger?.error(
        `${PasskeyAccountManager.name}#${_functionName}: ${_error}`
      );

      throw new PasskeyNotSupportedError(_error);
    }

    return {
      passkey: {
        algorithm,
        credentialID: AccountRepository.encode(
          new Uint8Array(credential.rawId)
        ),
        credentialName: _name,
        transports: (
          credential.response as AuthenticatorAttestationResponse
        ).getTransports() as AuthenticatorTransport[],
        userID: deviceID,
      },
      publicKey: new Uint8Array(publicKey),
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

  public static async signTransaction({
    logger,
    signer,
    transaction,
  }: ISignTransactionOptions): Promise<Uint8Array> {
    const _functionName = 'signTransaction';
    let _error: string;
    let credential: PublicKeyCredential | null;
    let signedTransaction: EncodedSignedTransaction;

    if (!signer.passkey) {
      _error = `the account "${convertPublicKeyToAVMAddress(
        signer.publicKey
      )}" does not have a passkey`;

      logger?.error(
        `${PasskeyAccountManager.name}#${_functionName}: ${_error}`
      );

      throw new InvalidAccountTypeError(_error);
    }

    try {
      credential = (await navigator.credentials.get({
        publicKey: {
          allowCredentials: [
            {
              id: AccountRepository.decode(signer.passkey.credentialID),
              transports: signer.passkey.transports,
              type: 'public-key',
            },
          ],
          challenge: transaction.bytesToSign(),
          userVerification: 'preferred',
        },
      })) as PublicKeyCredential | null;
    } catch (error) {
      logger?.error(`${PasskeyAccountManager.name}#${_functionName}:`, error);

      throw new UnableToFetchPasskeyError(
        signer.passkey.credentialID,
        error.message
      );
    }

    if (!credential) {
      _error = `failed to fetch passkey "${signer.passkey.credentialID}"`;

      logger?.error(
        `${PasskeyAccountManager.name}#${_functionName}: ${_error}`
      );

      throw new UnableToFetchPasskeyError(signer.passkey.credentialID, _error);
    }

    // TODO: the returned signature is the signed data of the concatenation of: response.authenticatorData + sha256(response.clientDataJSON)
    signedTransaction = {
      sig: Buffer.from(
        new Uint8Array(
          (credential.response as AuthenticatorAssertionResponse).signature
        )
      ),
      txn: transaction.get_obj_for_encoding(),
    };

    // add the `auth-address` if the signer account is not the account sending the transaction
    if (
      convertPublicKeyToAVMAddress(signer.publicKey) !==
      convertPublicKeyToAVMAddress(transaction.from.publicKey)
    ) {
      signedTransaction.sgnr = Buffer.from(
        AccountRepository.decode(signer.publicKey)
      );
    }

    // encode the msgpack
    return new Uint8Array(encodeMsgpack(signedTransaction));
  }
}
