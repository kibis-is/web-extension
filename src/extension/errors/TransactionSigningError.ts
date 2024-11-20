// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class TransactionSigningError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.TransactionSigningError;
  public readonly name: string = 'TransactionSigningError';
  public readonly txIDs: string[];

  constructor(txIDs: string[], message: string) {
    super(message);

    this.txIDs = txIDs;
  }
}
