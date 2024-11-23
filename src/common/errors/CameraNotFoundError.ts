// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class CameraNotFoundError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.CameraNotFoundError;
  public readonly name: string = 'CameraNotFoundError';
}
