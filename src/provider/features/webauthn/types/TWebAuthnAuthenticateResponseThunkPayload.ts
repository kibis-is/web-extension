// events
import WebAuthnAuthenticateRequestEvent from '@provider/events/WebAuthnAuthenticateRequestEvent';

// types
import type { TEncryptionCredentials } from '@provider/types';

interface IWebAuthnAuthenticateResponseThunkPayload {
  accountID: string;
  passkeyID: string;
  event: WebAuthnAuthenticateRequestEvent;
}
type TWebAuthnAuthenticateResponseThunkPayload = IWebAuthnAuthenticateResponseThunkPayload & TEncryptionCredentials;

export default TWebAuthnAuthenticateResponseThunkPayload;
