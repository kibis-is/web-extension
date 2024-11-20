// types
import type {
  INewAccountWithKeyPair,
  IPasskeyEncryptionCredentials,
  IPasswordEncryptionCredentials,
} from '@extension/types';

interface ISaveNewAccountsPayloadFragment {
  accounts: INewAccountWithKeyPair[];
}

type TSaveNewAccountsPayload = ISaveNewAccountsPayloadFragment &
  (IPasskeyEncryptionCredentials | IPasswordEncryptionCredentials);

export default TSaveNewAccountsPayload;
