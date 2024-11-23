// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// errors
import { BaseExtensionError } from '@common/errors';

// types
import type { IBaseResponseMessage } from '@common/types';
import type { IResult } from './types';

export default class WebAuthnThemeRequestMessage
  implements
    IBaseResponseMessage<IResult, WebAuthnMessageReferenceEnum.ThemeResponse>
{
  public readonly error: BaseExtensionError | null;
  public readonly id: string;
  public readonly reference: WebAuthnMessageReferenceEnum.ThemeResponse;
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
    WebAuthnMessageReferenceEnum.ThemeResponse
  >) {
    this.error = error;
    this.id = id;
    this.reference = reference;
    this.requestID = requestID;
    this.result = result;
  }
}
