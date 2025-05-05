// types
import type { IAccountWithExtendedProps, IAssetTypes, INativeCurrency } from '@provider/types';

interface IInitializePayload {
  sender: IAccountWithExtendedProps;
  asset: IAssetTypes | INativeCurrency;
}

export default IInitializePayload;
