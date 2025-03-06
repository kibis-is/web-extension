// events
import WebAuthnAuthenticateRequestEvent from '@extension/events/WebAuthnAuthenticateRequestEvent';

// types
import type { TEncryptionCredentials } from '@extension/types';

interface IWebAuthnAuthenticateResponseThunkPayload {
  accountID: string;
  passkeyID: string;
  event: WebAuthnAuthenticateRequestEvent;
}
type TWebAuthnAuthenticateResponseThunkPayload =
  IWebAuthnAuthenticateResponseThunkPayload & TEncryptionCredentials;

export default TWebAuthnAuthenticateResponseThunkPayload;
