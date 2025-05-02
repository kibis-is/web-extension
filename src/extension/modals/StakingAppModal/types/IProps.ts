// types
import type {
  IAccountStakingApp,
  IModalProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IProps extends IModalProps {
  app: IAccountStakingApp | null;
  network: INetworkWithTransactionParams | null;
}

export default IProps;
