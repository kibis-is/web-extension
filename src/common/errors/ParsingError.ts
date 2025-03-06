// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class ParsingError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.ParsingError;
  public readonly name: string = 'ParsingError';
}
