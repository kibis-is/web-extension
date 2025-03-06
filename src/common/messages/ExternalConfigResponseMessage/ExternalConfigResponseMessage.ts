// enums
import { ExternalConfigMessageReferenceEnum } from '@common/enums';

// types
import type {
  ISerializedProviderError,
  IBaseResponseMessage,
} from '@common/types';
import type { IResult } from './types';

export default class ExternalConfigResponseMessage
  implements
    IBaseResponseMessage<
      IResult,
      ISerializedProviderError,
      ExternalConfigMessageReferenceEnum.Response
    >
{
  public readonly error: ISerializedProviderError | null;
  public readonly id: string;
  public readonly reference: ExternalConfigMessageReferenceEnum.Response;
  public readonly requestID: string;
  public readonly result: IResult | null;

  constructor({
    error,
    id,
    reference,
    requestID,
    result,
  }: IBaseResponseMessage<
    IResult,
    ISerializedProviderError,
    ExternalConfigMessageReferenceEnum.Response
  >) {
    this.error = error;
    this.id = id;
    this.reference = reference;
    this.requestID = requestID;
    this.result = result;
  }
}
