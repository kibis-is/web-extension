interface ISerializedProviderError {
  readonly code: number;
  readonly isProviderError: boolean;
  message: string;
  readonly name: string;
}

export default ISerializedProviderError;
