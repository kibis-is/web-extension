// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// types
import type IRPOptions from './IRPOptions';
import type IUserOptions from './IUserOptions';

interface IGenerateOptions {
  challenge: Uint8Array;
  keyPair: Ed21559KeyPair;
  origin: string;
  rp: IRPOptions;
  user: IUserOptions;
}

export default IGenerateOptions;
