// types
import type { INewAccount, IPasskeyEncryptionCredentials, IPasswordEncryptionCredentials } from '@provider/types';

interface ISaveNewAccountsPayloadFragment {
  accounts: INewAccount[];
}

type TSaveNewAccountsPayload = ISaveNewAccountsPayloadFragment &
  (IPasskeyEncryptionCredentials | IPasswordEncryptionCredentials);

export default TSaveNewAccountsPayload;
