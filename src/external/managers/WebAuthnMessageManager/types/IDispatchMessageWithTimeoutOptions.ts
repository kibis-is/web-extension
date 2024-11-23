// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

interface IDispatchMessageWithTimeoutOptions<Message> {
  delay?: number;
  message: Message;
  responseReference: WebAuthnMessageReferenceEnum;
}

export default IDispatchMessageWithTimeoutOptions;
