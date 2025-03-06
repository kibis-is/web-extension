// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class NotEnoughMinimumBalanceError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum =
    ErrorCodeEnum.NotEnoughMinimumBalanceError;
  public readonly name: string = 'NotEnoughMinimumBalanceError';
}
