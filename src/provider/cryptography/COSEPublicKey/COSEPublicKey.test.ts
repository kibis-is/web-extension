import { ed25519 } from '@noble/curves/ed25519';
import { secp256r1 } from '@noble/curves/p256';
import { encode as encodeHex } from '@stablelib/hex';

// constants
import { COSE_ED25519_ALGORITHM, COSE_ES256_ALGORITHM } from '@common/constants';

// cryptography
import COSEPublicKey from './COSEPublicKey';

describe(COSEPublicKey.name, () => {
  describe('fromCBOR', () => {
    it('should create a cose public key from an ed21559 encoded cbor public key', () => {
      const publicKey = ed25519.getPublicKey(ed25519.utils.randomPrivateKey());
      const encodedCBOR = new COSEPublicKey({
        algorithm: COSE_ED25519_ALGORITHM,
        publicKey,
      }).toCBOR();
      const result = COSEPublicKey.fromCBOR(encodedCBOR);

      expect(encodeHex(result.publicKey(), true)).toBe(encodeHex(publicKey, true));
    });

    it('should create a cose public key from an es256 encoded cbor public key', () => {
      const publicKey = secp256r1.getPublicKey(secp256r1.utils.randomPrivateKey(), false);
      const encodedCBOR = new COSEPublicKey({
        algorithm: COSE_ES256_ALGORITHM,
        publicKey,
      }).toCBOR();
      const result = COSEPublicKey.fromCBOR(encodedCBOR);

      expect(encodeHex(result.publicKey(), true)).toBe(encodeHex(publicKey, true));
    });
  });
});
