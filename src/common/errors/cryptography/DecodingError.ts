// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import { BaseExtensionError } from '@common/errors';

export default class DecodingError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.DecodingError;
  public readonly name: string = 'DecodingError';
}
