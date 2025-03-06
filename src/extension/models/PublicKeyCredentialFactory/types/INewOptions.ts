// cryptography
import Ed21559KeyPair from '@extension/cryptography/Ed21559KeyPair';

// types
import type { IAccountPasskey } from '@extension/types';

interface INewOptions {
  challenge: string;
  keyPair: Ed21559KeyPair;
  passkey: IAccountPasskey;
}

export default INewOptions;
