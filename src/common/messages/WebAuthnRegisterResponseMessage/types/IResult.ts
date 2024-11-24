// types
import type IAuthenticatorAttestationResponse from './IAuthenticatorAttestationResponse';

/**
 * @property {"platform"} authenticatorAttachment - Indicates the mechanism by which the WebAuthn implementation is
 * attached. In this case, Kibisis is part of the browser, so it will always be "platform".
 * @property {string} id - The base64URL encoding of the `rawId`.
 * @property {"public-key"} type - The credential type. Will always be "public-key".
 */
interface IResult {
  authenticatorAttachment: 'platform';
  id: string;
  response: IAuthenticatorAttestationResponse;
  type: 'public-key';
}

export default IResult;
