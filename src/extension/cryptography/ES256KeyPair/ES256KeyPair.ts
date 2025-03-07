import { secp256r1 } from '@noble/curves/p256';
import { encode as encodeCBOR } from '@stablelib/cbor';

// constants
import { COSE_ES256_ALGORITHM } from '@common/constants';

// cryptography
import BaseSignKeyPair, {
  type IVerifyOptions,
} from '@extension/cryptography/BaseSignKeyPair';

// errors
import { InvalidKeyPairGenerationError } from '@common/errors';

export default class ES256KeyPair extends BaseSignKeyPair {
  /**
   * public static functions
   */

  /**
   * Generates a new ECDSA w/ SHA-256 (aka secp256r1) key pair.
   * @returns {ES256KeyPair} A new ECDSA w/ SHA-256 (aka secp256r1) key pair.
   * @public
   * @static
   */
  public static generate(): ES256KeyPair {
    const privateKey = secp256r1.utils.randomPrivateKey();

    return new ES256KeyPair({
      privateKey,
      publicKey: secp256r1.getPublicKey(privateKey, false),
    });
  }

  /**
   * Generates a ECDSA w/ SHA-256 (aka secp256r1) key pair. from a private key.
   * @param {Uint8Array} privateKey - a 32-byte private key.
   * @returns {ES256KeyPair} A new ECDSA w/ SHA-256 (aka secp256r1) key pair.
   * @public
   * @static
   */
  public static generateFromPrivateKey(privateKey: Uint8Array): ES256KeyPair {
    if (!secp256r1.utils.isValidPrivateKey(privateKey)) {
      throw new InvalidKeyPairGenerationError('invalid private key');
    }

    return new ES256KeyPair({
      privateKey,
      publicKey: secp256r1.getPublicKey(privateKey, false),
    });
  }

  /**
   * public functions
   */

  /**
   * Gets the COSE algorithm value.
   * @returns {number} The COSE algorithm: -7
   * @see {@link https://www.iana.org/assignments/cose/cose.xhtml}
   * @public
   */
  public coseAlgorithm(): -7 {
    return COSE_ES256_ALGORITHM;
  }

  public coseEncodedKey(): Uint8Array {
    return encodeCBOR({
      [1]: 2, // key type: ec2 (elliptic curve key with double coordinate curves)
      [3]: this.coseAlgorithm(), // algorithm: es256
      [-1]: 1, // curve: secp256r1 (p256)
      [-2]: this._publicKey.slice(1, 33), // x-coordinate (the first 32 bytes after the prefix)
      [-3]: this._publicKey.slice(33), // y-coordinate (the remaining 32 bytes after the x-coordinate)
    });
  }

  public secretKey(): Uint8Array {
    const secretKey = new Uint8Array(
      this._privateKey.length + this._publicKey.length
    );

    secretKey.set(this._privateKey);
    secretKey.set(this._publicKey, this._privateKey.length);

    return secretKey;
  }

  public sign(bytes: Uint8Array): Uint8Array {
    return secp256r1
      .sign(bytes, this._privateKey, { prehash: true })
      .toCompactRawBytes();
  }

  public verify({ bytes, signature }: IVerifyOptions): boolean {
    return secp256r1.verify(signature, bytes, this._publicKey);
  }
}
