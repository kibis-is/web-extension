interface INameResolutionResult {
  address: string;
  cached: boolean;
  name: string;
  type: 'addr';
}

export default INameResolutionResult;
