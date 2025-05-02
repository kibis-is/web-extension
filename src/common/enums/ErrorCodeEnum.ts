enum ErrorCodeEnum {
  // general
  UnknownError = 1000,
  MalformedDataError = 1001,
  ParsingError = 1002,
  NetworkNotSelectedError = 1003,
  NetworkConnectionError = 1004,

  // authentication
  InvalidPasswordError = 2000,

  // connection
  OfflineError = 3000,

  // transaction
  FailedToSendTransactionError = 4000,
  NotEnoughMinimumBalanceError = 4001,
  NotAZeroBalanceError = 4002,

  // contract (application)
  InvalidABIContractError = 5000,
  ReadABIContractError = 5001,

  // camera
  CameraError = 6000,
  CameraNotAllowedError = 6001,
  CameraNotFoundError = 6002,

  // screen capture
  ScreenCaptureError = 7000,
  ScreenCaptureNotAllowedError = 7001,
  ScreenCaptureNotFoundError = 7002,

  // passkey
  PasskeyNotSupportedError = 8000,
  PasskeyCreationError = 8001,
  UnableToFetchPasskeyError = 8002,

  // webauthn
  WebAuthnRegistrationCanceledError = 9000,
  WebAuthnMalformedRegistrationRequestError = 9001,
  WebAuthnInvalidPublicKeyError = 9002,
  WebAuthnAuthenticationCanceledError = 9003,
  WebAuthnMalformedAuthenticationRequestError = 9004,
  WebAuthnInvalidPasskeyError = 9005,
  WebAuthnNotEnabledError = 9006,

  // cryptography
  EncryptionError = 10000,
  DecryptionError = 10001,
  EncodingError = 10003,
  DecodingError = 10004,
  InvalidKeyPairGenerationError = 10005,
}

export default ErrorCodeEnum;
