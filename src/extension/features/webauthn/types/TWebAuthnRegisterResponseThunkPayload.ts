// events
import WebAuthnAuthenticateRequestEvent from '@extension/events/WebAuthnAuthenticateRequestEvent';
import WebAuthnRegisterRequestEvent from '@extension/events/WebAuthnRegisterRequestEvent';

// types
import type { TEncryptionCredentials } from '@extension/types';

interface IWebAuthnRegisterResponseThunkPayload {
  accountID: string;
  event: WebAuthnRegisterRequestEvent;
}
type TWebAuthnRegisterResponseThunkPayload =
  IWebAuthnRegisterResponseThunkPayload & TEncryptionCredentials;

export default TWebAuthnRegisterResponseThunkPayload;
