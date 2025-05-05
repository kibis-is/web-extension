// cryptography
import Ed21559KeyPair from '@provider/cryptography/Ed21559KeyPair';
import ES256KeyPair from '@provider/cryptography/ES256KeyPair';

// types
import type { IAccountPasskey } from '@provider/types';

interface INewOptions {
  challenge: string;
  keyPair: Ed21559KeyPair | ES256KeyPair;
  passkey: IAccountPasskey;
}

export default INewOptions;
