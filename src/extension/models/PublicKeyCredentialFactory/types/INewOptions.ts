// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// types
import type { IAccountPasskey } from '@extension/types';

interface INewOptions {
  challenge: Uint8Array;
  keyPair: Ed21559KeyPair;
  passkey: IAccountPasskey;
}

export default INewOptions;
