/**
 * @property {Uint8Array} aaguid - The Authenticator Attestation Globally Unique Identifier. 16-bytes.
 * @property {Uint8Array} credentialID - The unique identifier for the credential. This will be variable length, but
 * the length **SHOULD** be defined in `credentialIDLength`.
 * @property {Uint8Array} credentialIDLength - The byte length of the `credentialID`. 2-bytes.
 * @property {Uint8Array} credentialPublicKey - The CBOR encoded COSE public key credential. Variable bytes.
 */
interface IParsedAttestedCredentialData {
  aaguid: Uint8Array;
  credentialID: Uint8Array;
  credentialIDLength: Uint8Array;
  credentialPublicKey: Uint8Array;
}

export default IParsedAttestedCredentialData;
