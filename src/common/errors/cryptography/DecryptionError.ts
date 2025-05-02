// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import { BaseExtensionError } from '@common/errors';

export default class DecryptionError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.DecryptionError;
  public readonly name: string = 'DecryptionError';
}
