// types
import type { IAccountPasskey } from '@extension/types';

interface ICreatePasskeyResult {
  passkey: IAccountPasskey;
  publicKey: Uint8Array;
}

export default ICreatePasskeyResult;
