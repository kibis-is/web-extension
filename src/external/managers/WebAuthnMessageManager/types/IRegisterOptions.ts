// types
import type { IClientInformation } from '@common/types';

interface IRegisterOptions {
  clientInfo: IClientInformation;
  publicKeyCreationOptions: PublicKeyCredentialCreationOptions;
}

export default IRegisterOptions;
