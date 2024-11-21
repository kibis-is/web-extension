// messages
import {
  WebAuthnGetRequestMessage,
  WebAuthnCreateRequestMessage,
} from '@common/messages';

interface IWebAuthnRequestEventPayload {
  message: WebAuthnCreateRequestMessage | WebAuthnGetRequestMessage;
  originTabId: number;
}

export default IWebAuthnRequestEventPayload;
