import { secp256r1 } from '@noble/curves/p256';

// cryptography
import Ed21559KeyPair from '@provider/cryptography/Ed21559KeyPair';
import ES256KeyPair from './ES256KeyPair';

// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import { BaseExtensionError } from '@common/errors';

describe(ES256KeyPair.name, () => {
  it('should throw an error if the private key is invalid', () => {
    try {
      ES256KeyPair.generateFromPrivateKey(new Uint8Array(2));
    } catch (error) {
      expect((error as BaseExtensionError).isProviderError).toBe(true);
      expect((error as BaseExtensionError).code).toBe(ErrorCodeEnum.InvalidKeyPairGenerationError);

      return;
    }

    throw new Error(`expected a invalid private key error`);
  });

  it('should create a private key from an existing private key', () => {
    const privateKey = secp256r1.utils.randomPrivateKey();
    const keyPair = ES256KeyPair.generateFromPrivateKey(privateKey);

    expect(Buffer.from(keyPair.privateKey()).toString('hex')).toBe(Buffer.from(privateKey).toString('hex'));
  });

  it('should create a private key from an ed21559 private key', () => {
    const ed21559KeyPair = Ed21559KeyPair.generate();
    const keyPair = ES256KeyPair.generateFromPrivateKey(ed21559KeyPair.privateKey());

    expect(Buffer.from(keyPair.privateKey()).toString('hex')).toBe(
      Buffer.from(ed21559KeyPair.privateKey()).toString('hex')
    );
  });
});
