// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class PrivateKeyAlreadyExistsError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum =
    ErrorCodeEnum.PrivateKeyAlreadyExistsError;
  public readonly name: string = 'PrivateKeyAlreadyExistsError';
}
