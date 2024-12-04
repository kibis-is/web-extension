// types
import type {
  IAppProps as IBaseAppProps,
  IClientInformation,
  ILogger,
} from '@common/types';

interface IAppProps extends IBaseAppProps {
  clientInfo: IClientInformation;
  navigatorCredentialsCreateFn: typeof navigator.credentials.create;
  logger?: ILogger;
  onClose: () => void;
  onResponse: (response: PublicKeyCredential | null) => void;
  publicKeyCreationOptions: PublicKeyCredentialCreationOptions;
}

export default IAppProps;
