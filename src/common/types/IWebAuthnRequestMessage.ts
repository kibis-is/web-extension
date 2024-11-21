// messages
import { IClientInformation } from '@common/types';

interface IWebAuthnRequestMessage<
  Options = CredentialCreationOptions | CredentialRequestOptions
> {
  clientInfo: IClientInformation;
  id: string;
  options: Options;
}

export default IWebAuthnRequestMessage;
