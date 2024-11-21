// errors
import { BaseExtensionError } from '@extension/errors';

interface IWebAuthnResponseMessage {
  error: BaseExtensionError | null;
  id: string;
  requestID: string;
  result: PublicKeyCredential | null;
}

export default IWebAuthnResponseMessage;
