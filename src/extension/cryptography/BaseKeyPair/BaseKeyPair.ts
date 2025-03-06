// types
import type { INewOptions } from './types';

export default abstract class BaseKeyPair {
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
   * Gets the secret key for signing. The secret key is a 64 byte concatenation of the private key (32 byte) and the
   * public key (32 byte).
   * @returns {Uint8Array} the secret key used for signing.
   * @public
   */
  public abstract secretKey(): Uint8Array;

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
