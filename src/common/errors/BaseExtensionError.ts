// enums
import { ErrorCodeEnum } from '@common/enums';

export default abstract class BaseExtensionError extends Error {
  public readonly code: ErrorCodeEnum;
  public readonly isProviderError = true;
  public message: string;
  public readonly name: string;

  public constructor(message: string) {
    super(message.toLowerCase());
  }
}
