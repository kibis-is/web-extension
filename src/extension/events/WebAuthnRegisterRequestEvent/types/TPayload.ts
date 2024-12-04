// messages
import WebAuthnRegisterRequestMessage from '@common/messages/WebAuthnRegisterRequestMessage';

// types
import type { IBaseMessageEventPayload } from '@extension/types';

type TPayload = IBaseMessageEventPayload<WebAuthnRegisterRequestMessage>;

export default TPayload;
