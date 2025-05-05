// types
import type { ISerializedPublicKeyCredentialRequestOptions } from '@common/types';
import type { IAccountPasskey } from '@provider/types';

interface IInitOptions {
  passkey: IAccountPasskey;
  privateKey: Uint8Array;
  publicKeyCredentialRequestOptions: ISerializedPublicKeyCredentialRequestOptions;
}

export default IInitOptions;
