// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// types
import type {
  ISerializedProviderError,
  IBaseResponseMessage,
} from '@common/types';
import type { IResult } from './types';

export default class WebAuthnRegisterResponseMessage
  implements
    IBaseResponseMessage<
      IResult,
      WebAuthnMessageReferenceEnum.RegisterResponse,
      ISerializedProviderError
    >
{
  public readonly error: ISerializedProviderError | null;
  public readonly id: string;
  public readonly reference: WebAuthnMessageReferenceEnum.RegisterResponse;
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
    WebAuthnMessageReferenceEnum.RegisterResponse,
    ISerializedProviderError
  >) {
    this.error = error;
    this.id = id;
    this.reference = reference;
    this.requestID = requestID;
    this.result = result;
  }
}
