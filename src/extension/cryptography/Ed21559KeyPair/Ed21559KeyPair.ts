import { ed25519 } from '@noble/curves/ed25519';

// constants
import { COSE_ED25519_ALGORITHM } from '@common/constants';

// errors
import { InvalidKeyPairGenerationError } from '@common/errors';

// cryptography
import BaseSignKeyPair, {
  type IVerifyOptions,
} from '@extension/cryptography/BaseSignKeyPair';

export default class Ed21559KeyPair extends BaseSignKeyPair {
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
   * The secret key is the concatenation of the private key (32 byte) + the (uncompressed) public key.
   * @returns {Uint8Array} The secret key.
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

  public sign(bytes: Uint8Array): Uint8Array {
    return ed25519.sign(bytes, this._privateKey);
  }

  public verify({ bytes, signature }: IVerifyOptions): boolean {
    return ed25519.verify(signature, bytes, this._publicKey);
  }
}
