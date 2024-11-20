// types
import type { IAccountPasskey } from '@extension/types';

interface ISaveNewPasskeyAccountPayload {
  passkey: IAccountPasskey;
  publicKey: Uint8Array;
  name: string | null;
}

export default ISaveNewPasskeyAccountPayload;
