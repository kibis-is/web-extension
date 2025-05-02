// types
import type {
  IARC0072AssetHolding,
  IModalProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IProps {
  item: IARC0072AssetHolding | null;
  network: INetworkWithTransactionParams | null;
}

type TProps = IModalProps & IProps;

export default TProps;
