// types
import type { INewOptions, IVerifyOptions } from './types';

export default abstract class BaseSignKeyPair {
  // protected variables
  protected readonly _privateKey: Uint8Array;
  protected readonly _publicKey: Uint8Array;

  protected constructor({ privateKey, publicKey }: INewOptions) {
    this._privateKey = privateKey;
    this._publicKey = publicKey;
  }

  /**
   * public abstract functions
   */

  /**
   * The secret key is the concatenation of the private key (32 byte) + the (uncompressed) public key.
   * @returns {Uint8Array} The secret key.
   * @public
   */
  public abstract secretKey(): Uint8Array;

  /**
   * Signs some given bytes.
   * @param {Uint8Array} bytes - The bytes to sign.
   * @returns {Uint8Array} The signature of the signing result.
   */
  public abstract sign(bytes: Uint8Array): Uint8Array;

  /**
   * Verifies the signature against some signed bytes.
   * @param {IVerifyOptions} options - The bytes used to sign and the resulting signature .
   * @returns {boolean} True if the signature is the result of the key pair signing the bytes.
   */
  public abstract verify(options: IVerifyOptions): boolean;

  /**
   * public functions
   */

  /**
   * Gets the private key.
   * @returns {Uint8Array} The private key.
   * @public
   */
  public privateKey(): Uint8Array {
    return this._privateKey;
  }

  /**
   * Gets the public key.
   * @returns {Uint8Array} The public key.
   * @public
   */
  public publicKey(): Uint8Array {
    return this._publicKey;
  }
}
