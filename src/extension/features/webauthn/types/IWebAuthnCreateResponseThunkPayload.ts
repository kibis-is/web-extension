// errors
import { BaseExtensionError } from '@common/errors';

// types
import type { IWebAuthnRequestEvent } from '@extension/types';

interface IWebAuthnCreateResponseThunkPayload {
  accountID: string | null;
  error: BaseExtensionError | null;
  event: IWebAuthnRequestEvent;
}

export default IWebAuthnCreateResponseThunkPayload;
