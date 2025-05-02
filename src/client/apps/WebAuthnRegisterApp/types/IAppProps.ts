// types
import type { IBaseAppProps } from '@client/types';

interface IAppProps extends IBaseAppProps {
  credentialCreationOptions: CredentialCreationOptions;
  navigatorCredentialsCreateFn: typeof navigator.credentials.create;
}

export default IAppProps;
