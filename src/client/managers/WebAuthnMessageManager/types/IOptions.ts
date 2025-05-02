// types
import type { IClientInformation } from '@common/types';

interface IOptions<
  Options extends
    | PublicKeyCredentialCreationOptions
    | PublicKeyCredentialRequestOptions
> {
  clientInfo: IClientInformation;
  publicKeyOptions: Options | null;
}

export default IOptions;
