// types
import type IParsedAttestedCredentialData from './IParsedAttestedCredentialData';

interface IParsedAuthenticatorData {
  attestedCredentialData: IParsedAttestedCredentialData | null;
  flags: Uint8Array;
  rpIdHash: Uint8Array;
  signCount: Uint8Array;
}

export default IParsedAuthenticatorData;
