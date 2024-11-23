// errors
import { BaseExtensionError } from '@common/errors';

interface IWebAuthnResponseMessage {
  error: BaseExtensionError | null;
  id: string;
  requestID: string;
  result: PublicKeyCredential | null;
}

export default IWebAuthnResponseMessage;
