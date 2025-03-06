// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import { BaseExtensionError } from '@common/errors';

export default class InvalidKeyPairGenerationError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum =
    ErrorCodeEnum.InvalidKeyPairGenerationError;
  public readonly name: string = 'InvalidKeyPairGenerationError';
}
