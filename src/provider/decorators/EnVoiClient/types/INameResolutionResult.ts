interface INameResolutionResult {
  address: string;
  cached: boolean;
  name: string | null;
  type?: 'addr';
}

export default INameResolutionResult;
