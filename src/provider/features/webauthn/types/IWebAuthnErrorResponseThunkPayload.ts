// errors
import { BaseExtensionError } from '@common/errors';

// events
import WebAuthnAuthenticateRequestEvent from '@provider/events/WebAuthnAuthenticateRequestEvent';
import WebAuthnRegisterRequestEvent from '@provider/events/WebAuthnRegisterRequestEvent';

interface IWebAuthnErrorResponseThunkPayload {
  error: BaseExtensionError;
  event: WebAuthnAuthenticateRequestEvent | WebAuthnRegisterRequestEvent;
}

export default IWebAuthnErrorResponseThunkPayload;
