interface ITokenIDResolutionResponse<Metadata = Record<string, unknown>> {
  address: string | null;
  cached: boolean;
  metadata: Metadata;
  name: string | null;
  token_id: string;
}

export default ITokenIDResolutionResponse;
