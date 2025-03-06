// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// types
import type { ISerializedPublicKeyCredentialRequestOptions } from '@common/types';
import type { IAccountPasskey } from '@extension/types';

interface IInitOptions {
  keyPair: Ed21559KeyPair;
  passkey: IAccountPasskey;
  publicKeyCredentialRequestOptions: ISerializedPublicKeyCredentialRequestOptions;
}

export default IInitOptions;
