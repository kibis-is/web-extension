// types
import type { IClientInformation } from '@common/types';

interface IRegisterOptions {
  clientInfo: IClientInformation;
  publicKeyCreationOptions: PublicKeyCredentialCreationOptions | null;
}

export default IRegisterOptions;
