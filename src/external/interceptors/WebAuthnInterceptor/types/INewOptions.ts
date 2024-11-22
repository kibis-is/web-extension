// types
import type { IBaseOptions } from '@common/types';

interface INewOptions extends IBaseOptions {
  navigatorCredentialsCreateFn: typeof navigator.credentials.create;
}

export default INewOptions;
