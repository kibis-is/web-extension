// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class NetworkConnectionError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.NetworkConnectionError;
  public readonly name: string = 'NetworkConnectionError';
}
