// errors
import { BaseExtensionError } from '@common/errors';

// types
import type IBaseMessage from './IBaseMessage';

interface IBaseResponseMessage<
  Result,
  Error = BaseExtensionError,
  Reference = string
> extends IBaseMessage<Reference> {
  error: Error | null;
  requestID: string;
  result: Result | null;
}

export default IBaseResponseMessage;
