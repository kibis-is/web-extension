// types
import type {
  IAppProps as IBaseAppProps,
  IClientInformation,
} from '@common/types';

interface IAppProps extends IBaseAppProps {
  clientInfo: IClientInformation;
  navigatorCredentialsCreateFn: typeof navigator.credentials.create;
  onClose: () => void;
  onResponse: (response: PublicKeyCredential | null) => void;
  options?: CredentialCreationOptions;
}

export default IAppProps;
