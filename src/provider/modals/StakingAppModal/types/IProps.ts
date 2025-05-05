// types
import type { IAccountStakingApp, IModalProps, INetworkWithTransactionParams } from '@provider/types';

interface IProps extends IModalProps {
  app: IAccountStakingApp | null;
  network: INetworkWithTransactionParams | null;
}

export default IProps;
