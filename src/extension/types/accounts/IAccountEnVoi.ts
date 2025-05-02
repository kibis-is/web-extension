// types
import type { IARC0072AssetHolding } from '@extension/types';

interface IAccountEnVoi {
  items: IARC0072AssetHolding[];
  primaryName: string | null;
}

export default IAccountEnVoi;
