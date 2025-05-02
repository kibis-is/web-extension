// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class NotAZeroBalanceError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.NotAZeroBalanceError;
  public readonly name: string = 'NotAZeroBalanceError';
}
