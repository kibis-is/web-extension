// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// types
import type { IBaseMessage } from '@common/types';

export default class WebAuthnThemeRequestMessage
  implements IBaseMessage<WebAuthnMessageReferenceEnum.ThemeRequest>
{
  public readonly id: string;
  public readonly reference: WebAuthnMessageReferenceEnum.ThemeRequest;

  constructor({
    id,
    reference,
  }: IBaseMessage<WebAuthnMessageReferenceEnum.ThemeRequest>) {
    this.id = id;
    this.reference = reference;
  }
}
