import { decode as decodeCBOR, encode as encodeCBOR } from '@stablelib/cbor';

// constants
import {
  COSE_ED25519_ALGORITHM,
  COSE_ES256_ALGORITHM,
} from '@common/constants';

// errors
import { MalformedDataError } from '@common/errors';

// types
import type { INewOptions } from './types';

export default class COSEPublicKey {
  // protected variables
  protected readonly _algorithm: number;
  protected readonly _publicKey: Uint8Array;

  public constructor({ algorithm, publicKey }: INewOptions) {
    this._algorithm = algorithm;
    this._publicKey = publicKey;
  }

  /**
   * public static
   */

  /**
   * Creates a new `COSEPublicKey` instance from a CBOR encoded COSE public key that conforms to the RFC-9052
   * specification.
   * @param {Uint8Array} value - A CBOR encoded COSE public key that conforms to the RFC-9052 specification.
   * @see {@link https://datatracker.ietf.org/doc/html/rfc9052}
   * @static
   * @public
   */
  public static fromCBOR(value: Uint8Array): COSEPublicKey {
    const decoded = decodeCBOR(value);
    let publicKey: Uint8Array;

    switch (decoded['3']) {
      case COSE_ED25519_ALGORITHM:
        if (!decoded['-2']) {
          throw new MalformedDataError(
            `malformed cose key: ${JSON.stringify(decoded)}`
          );
        }

        publicKey = decoded['-2'];

        if (publicKey.length !== 32) {
          throw new MalformedDataError(
            `invalid cose key public key length for "${COSE_ED25519_ALGORITHM}", expected 32-bytes found ${publicKey.length}-bytes`
          );
        }

        break;
      case COSE_ES256_ALGORITHM:
        if (!decoded['-2'] || !decoded['-3']) {
          throw new MalformedDataError(
            `malformed cose key: ${JSON.stringify(decoded)}`
          );
        }

        if (decoded['-2'].length !== 32) {
          throw new MalformedDataError(
            `invalid cose key public key length for "${COSE_ES256_ALGORITHM}" x-coordinate, expected 32-bytes found ${decoded['-2'].length}-bytes`
          );
        }

        if (decoded['-3'].length !== 32) {
          throw new MalformedDataError(
            `invalid cose key public key length for "${COSE_ES256_ALGORITHM}" y-coordinate, expected 32-bytes found ${decoded['-3'].length}-bytes`
          );
        }

        publicKey = new Uint8Array(65);

        publicKey[0] = 0x04; // uncompressed key prefix
        publicKey.set(decoded['-2'], 1); // x-coordinate
        publicKey.set(decoded['-3'], 33); // y-coordinate
        break;
      default:
        throw new MalformedDataError(
          `malformed cose key: ${JSON.stringify(decoded)}`
        );
    }

    return new COSEPublicKey({
      algorithm: decoded['3'],
      publicKey,
    });
  }

  /**
   * public functions
   */

  /**
   * Gets the COSE algorithm.
   * @returns {number} The COSE algorithm.
   * @see {@link https://www.iana.org/assignments/cose/cose.xhtml#algorithms}
   * @public
   */
  public algorithm(): number {
    return this._algorithm;
  }

  /**
   * Gets the COSE curve for the specified algorithm.
   * @returns {number} The COSE curve for the specified algorithm.
   * @see {@link https://www.iana.org/assignments/cose/cose.xhtml#elliptic-curves}
   * @public
   */
  public curve(): number {
    switch (this._algorithm) {
      case COSE_ED25519_ALGORITHM:
        return 6; // curve: ed25519
      case COSE_ES256_ALGORITHM:
        return 1; // curve: secp256r1 (p256)
      default:
        throw new MalformedDataError(
          `unsupported cose algorithm: "${this._algorithm}"`
        );
    }
  }

  /**
   * Gets the COSE key type for the specified algorithm.
   * @returns {number} The COSE key type for the specified algorithm.
   * @see {@link https://www.iana.org/assignments/cose/cose.xhtml#key-type}
   * @public
   */
  public keyType(): number {
    switch (this._algorithm) {
      case COSE_ED25519_ALGORITHM:
        return 1; // okp (octet key pair)
      case COSE_ES256_ALGORITHM:
        return 2; // ec2 (elliptic curve key with double coordinate curves)
      default:
        throw new MalformedDataError(
          `unsupported cose algorithm: "${this._algorithm}"`
        );
    }
  }

  /**
   * Gets the raw uncompressed public key.
   * @returns {Uint8Array} The raw uncompressed public key.
   * @public
   */
  public publicKey(): Uint8Array {
    return this._publicKey;
  }

  /**
   * Creates a CBOR encoded version of the COSE public key that conforms to the RFC-9052 specification.
   * @returns {Uint8Array} A CBOR encoded COSE public key that conforms to RFC-9052.
   * @see {@link https://datatracker.ietf.org/doc/html/rfc9052}
   * @public
   */
  public toCBOR(): Uint8Array {
    const value: Record<number, number | Uint8Array> = {
      [1]: this.keyType(),
      [3]: this.algorithm(),
      [-1]: this.curve(),
    };

    switch (this._algorithm) {
      case COSE_ED25519_ALGORITHM:
        return encodeCBOR({
          ...value,
          [-2]: this._publicKey, // public key bytes
        });
      case COSE_ES256_ALGORITHM:
        return encodeCBOR({
          ...value,
          [-2]: this._publicKey.slice(1, 33), // x-coordinate (the first 32 bytes after the prefix)
          [-3]: this._publicKey.slice(33), // y-coordinate (the remaining 32 bytes after the x-coordinate)
        });
      default:
        throw new MalformedDataError(
          `unsupported cose algorithm: "${this._algorithm}"`
        );
    }
  }
}
