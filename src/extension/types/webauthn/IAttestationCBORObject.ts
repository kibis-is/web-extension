interface IAttestationCBORObject {
  attStmt: Record<string, unknown>;
  authData: Uint8Array;
  fmt:
    | 'android-key'
    | 'android-safetynet'
    | 'fido-u2f'
    | 'none'
    | 'packed'
    | 'tpm';
}

export default IAttestationCBORObject;
