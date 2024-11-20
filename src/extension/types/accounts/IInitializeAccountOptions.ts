// types
import type IAccountPasskey from './IAccountPasskey';

interface IInitializeAccountOptions {
  createdAt?: number;
  id?: string;
  name?: string;
  passkey?: IAccountPasskey;
  publicKey: string;
}

export default IInitializeAccountOptions;
