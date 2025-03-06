import { ed25519 } from '@noble/curves/ed25519';

// constants
import { COSE_ED25519_ALGORITHM } from '@common/constants';

// errors
import { InvalidKeyPairGenerationError } from '@common/errors';

// cryptography
import BaseKeyPair from '@extension/cryptography/BaseKeyPair';

export default class Ed21559KeyPair extends BaseKeyPair {
  /**
   * public static functions
   */

  /**
   * Generates a new Ed21559 key pair.
   * @returns {Ed21559KeyPair} a new Ed21559 key pair.
   * @public
   * @static
   */
  public static generate(): Ed21559KeyPair {
    const privateKey = ed25519.utils.randomPrivateKey();

    return new Ed21559KeyPair({
      privateKey,
      publicKey: ed25519.getPublicKey(privateKey),
    });
  }

  /**
   * Generates an Ed21559 key pair from a private key.
   * @param {Uint8Array} privateKey - a 32-byte private key.
   * @returns {Ed21559KeyPair} a new Ed21559 key pair.
   * @public
   * @static
   */
  public static generateFromPrivateKey(privateKey: Uint8Array): Ed21559KeyPair {
    if (privateKey.length !== 32) {
      throw new InvalidKeyPairGenerationError('private key is not 32-bytes');
    }

    return new Ed21559KeyPair({
      privateKey,
      publicKey: ed25519.getPublicKey(privateKey),
    });
  }

  /**
   * public functions
   */

  /**
   * Gets the COSE algorithm value.
   * @returns {number} The COSE algorithm: -8
   * @see {@link https://www.iana.org/assignments/cose/cose.xhtml}
   * @public
   */
  public coseAlgorithm(): number {
    return COSE_ED25519_ALGORITHM;
  }

  /**
   * Gets the secret key for signing. The secret key is a 64 byte concatenation of the private key (32 byte) and the
   * public key (32 byte).
   * @returns {Uint8Array} The secret key used for signing.
   * @public
   */
  public secretKey(): Uint8Array {
    const secretKey = new Uint8Array(
      this._privateKey.length + this._publicKey.length
    );

    secretKey.set(this._privateKey);
    secretKey.set(this._publicKey, this._privateKey.length);

    return secretKey;
  }
}
