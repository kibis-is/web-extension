// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IProps {
  account: IAccountWithExtendedProps;
  network: INetworkWithTransactionParams;
  onEnVoiSelect: (index: number) => void;
}

export default IProps;
