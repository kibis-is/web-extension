// cryptography
import Ed21559KeyPair from '@extension/cryptography/Ed21559KeyPair';
import ES256KeyPair from '@extension/cryptography/ES256KeyPair';

// types
import type { IAccountPasskey } from '@extension/types';

interface INewOptions {
  challenge: string;
  keyPair: Ed21559KeyPair | ES256KeyPair;
  passkey: IAccountPasskey;
}

export default INewOptions;
