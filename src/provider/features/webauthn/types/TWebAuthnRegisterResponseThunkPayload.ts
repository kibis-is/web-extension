// events
import WebAuthnAuthenticateRequestEvent from '@provider/events/WebAuthnAuthenticateRequestEvent';
import WebAuthnRegisterRequestEvent from '@provider/events/WebAuthnRegisterRequestEvent';

// types
import type { TEncryptionCredentials } from '@provider/types';

interface IWebAuthnRegisterResponseThunkPayload {
  accountID: string;
  event: WebAuthnRegisterRequestEvent;
}
type TWebAuthnRegisterResponseThunkPayload = IWebAuthnRegisterResponseThunkPayload & TEncryptionCredentials;

export default TWebAuthnRegisterResponseThunkPayload;
