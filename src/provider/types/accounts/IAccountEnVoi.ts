// types
import type { IEnVoiHolding } from '@provider/types';

interface IAccountEnVoi {
  items: IEnVoiHolding[];
  primaryName: string | null;
}

export default IAccountEnVoi;
