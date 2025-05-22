// types
import type { IAssetTypes, INativeCurrency } from '@provider/types';

interface IOnEventOptions {
  asset: IAssetTypes | INativeCurrency | null;
  maximumAmountInAtomicUnits: string;
}

export default IOnEventOptions;
