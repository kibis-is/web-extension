// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// errors
import { BaseExtensionError } from '@extension/errors';

// types
import type { IBaseResponseMessage } from '@common/types';
import type { IResult } from './types';

export default class WebAuthnAccountsRequestMessage
  implements
    IBaseResponseMessage<
      IResult,
      WebAuthnMessageReferenceEnum.AccountsResponse
    >
{
  public readonly error: BaseExtensionError | null;
  public readonly id: string;
  public readonly reference: WebAuthnMessageReferenceEnum.AccountsResponse;
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
    WebAuthnMessageReferenceEnum.AccountsResponse
  >) {
    this.error = error;
    this.id = id;
    this.reference = reference;
    this.requestID = requestID;
    this.result = result;
  }
}
