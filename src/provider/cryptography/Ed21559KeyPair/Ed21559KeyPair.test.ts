import { ed25519 } from '@noble/curves/ed25519';

// cryptography
import Ed21559KeyPair from './Ed21559KeyPair';

// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import { BaseExtensionError } from '@common/errors';

describe(Ed21559KeyPair.name, () => {
  it('should throw an error if the private key is invalid', () => {
    try {
      Ed21559KeyPair.generateFromPrivateKey(new Uint8Array(2));
    } catch (error) {
      expect((error as BaseExtensionError).isProviderError).toBe(true);
      expect((error as BaseExtensionError).code).toBe(ErrorCodeEnum.InvalidKeyPairGenerationError);

      return;
    }

    throw new Error(`expected a invalid private key error`);
  });

  it('should create a private key from an existing private key', () => {
    const privateKey = ed25519.utils.randomPrivateKey();
    const keyPair = Ed21559KeyPair.generateFromPrivateKey(privateKey);

    expect(Buffer.from(keyPair.privateKey()).toString('hex')).toBe(Buffer.from(privateKey).toString('hex'));
  });
});
