// types
import type { IBaseComponentProps } from '@common/types';
import type {
  IAssetTypes,
  INativeCurrency,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IProps extends IBaseComponentProps {
  assets: (IAssetTypes | INativeCurrency)[];
  disabled?: boolean;
  label?: string;
  network: INetworkWithTransactionParams;
  onSelect: (account: IAssetTypes | INativeCurrency) => void;
  required?: boolean;
  value: IAssetTypes | INativeCurrency;
}

export default IProps;
