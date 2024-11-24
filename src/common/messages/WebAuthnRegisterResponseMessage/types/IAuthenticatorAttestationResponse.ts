/**
 * @property {string} attestationObject - The base64 encoded authenticator data and an attestation statement.
 * @property {string} clientDataJSON - The base64 encoded JSON-compatible serialization of the data passed from the
 * browser to the authenticator in order to generate this credential
 */
interface IAuthenticatorAttestationResponse {
  attestationObject: string;
  clientDataJSON: string;
}

export default IAuthenticatorAttestationResponse;
