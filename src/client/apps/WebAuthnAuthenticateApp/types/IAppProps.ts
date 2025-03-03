// types
import type { IBaseAppProps } from '@client/types';

interface IAppProps extends IBaseAppProps {
  credentialRequestOptions: CredentialRequestOptions;
  navigatorCredentialsGetFn: typeof navigator.credentials.get;
}

export default IAppProps;
