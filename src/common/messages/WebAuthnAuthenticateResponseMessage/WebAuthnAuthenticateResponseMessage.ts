// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// types
import type {
  ISerializedProviderError,
  IBaseResponseMessage,
} from '@common/types';
import type { IResult } from './types';

export default class WebAuthnAuthenticateResponseMessage
  implements
    IBaseResponseMessage<
      IResult,
      ISerializedProviderError,
      WebAuthnMessageReferenceEnum.AuthenticateResponse
    >
{
  public readonly error: ISerializedProviderError | null;
  public readonly id: string;
  public readonly reference: WebAuthnMessageReferenceEnum.AuthenticateResponse;
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
    WebAuthnMessageReferenceEnum.AuthenticateResponse
  >) {
    this.error = error;
    this.id = id;
    this.reference = reference;
    this.requestID = requestID;
    this.result = result;
  }
}
