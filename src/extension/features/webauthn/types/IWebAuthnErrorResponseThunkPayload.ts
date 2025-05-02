// errors
import { BaseExtensionError } from '@common/errors';

// events
import WebAuthnAuthenticateRequestEvent from '@extension/events/WebAuthnAuthenticateRequestEvent';
import WebAuthnRegisterRequestEvent from '@extension/events/WebAuthnRegisterRequestEvent';

interface IWebAuthnErrorResponseThunkPayload {
  error: BaseExtensionError;
  event: WebAuthnAuthenticateRequestEvent | WebAuthnRegisterRequestEvent;
}

export default IWebAuthnErrorResponseThunkPayload;
