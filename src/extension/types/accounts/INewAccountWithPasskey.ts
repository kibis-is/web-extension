// enums
import { DelimiterEnum } from '@extension/enums';

// types
import type IAccountPasskey from './IAccountPasskey';

interface INewAccountWithPasskey {
  __delimiter: DelimiterEnum.Passkey;
  name: string | null;
  passkey: IAccountPasskey;
  publicKey: Uint8Array;
}

export default INewAccountWithPasskey;
