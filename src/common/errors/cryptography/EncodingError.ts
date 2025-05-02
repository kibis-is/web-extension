// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import { BaseExtensionError } from '@common/errors';

export default class EncodingError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.EncodingError;
  public readonly name: string = 'EncodingError';
}
