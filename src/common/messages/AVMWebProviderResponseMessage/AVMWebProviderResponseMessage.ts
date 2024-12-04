import {
  ARC0027MethodEnum,
  BaseARC0027Error,
} from '@agoralabs-sh/avm-web-provider';

// enums
import { AVMWebProviderMessageReferenceEnum } from '@common/enums';

// types
import type { IMessage } from './types';

export default class AVMWebProviderResponseMessage<Result>
  implements IMessage<Result>
{
  public readonly error: BaseARC0027Error | null;
  public readonly id: string;
  public readonly method: ARC0027MethodEnum;
  public readonly reference: AVMWebProviderMessageReferenceEnum.Response;
  public readonly requestID: string;
  public readonly result: Result | null;

  constructor({
    error,
    id,
    method,
    reference,
    requestID,
    result,
  }: IMessage<Result>) {
    this.error = error;
    this.id = id;
    this.method = method;
    this.reference = reference;
    this.requestID = requestID;
    this.result = result;
  }
}
