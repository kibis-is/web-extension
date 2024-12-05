// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// types
import type {
  ISerializedProviderError,
  IBaseResponseMessage,
} from '@common/types';
import type { IResult } from './types';

export default class WebAuthnConfigResponseMessage
  implements
    IBaseResponseMessage<
      IResult,
      WebAuthnMessageReferenceEnum.ConfigResponse,
      ISerializedProviderError
    >
{
  public readonly error: ISerializedProviderError | null;
  public readonly id: string;
  public readonly reference: WebAuthnMessageReferenceEnum.ConfigResponse;
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
    WebAuthnMessageReferenceEnum.ConfigResponse,
    ISerializedProviderError
  >) {
    this.error = error;
    this.id = id;
    this.reference = reference;
    this.requestID = requestID;
    this.result = result;
  }
}
