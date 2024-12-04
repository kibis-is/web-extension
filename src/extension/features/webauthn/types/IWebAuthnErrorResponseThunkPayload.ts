// errors
import { BaseExtensionError } from '@common/errors';

// events
import WebAuthnRegisterRequestEvent from '@extension/events/WebAuthnRegisterRequestEvent';

interface IWebAuthnErrorResponseThunkPayload {
  error: BaseExtensionError;
  event: WebAuthnRegisterRequestEvent;
}

export default IWebAuthnErrorResponseThunkPayload;
