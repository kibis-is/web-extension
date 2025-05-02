// types
import { IBaseComponentProps } from '@common/types';
import type {
  IAccountStakingApp,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IProps {
  fetching: boolean;
  network: INetworkWithTransactionParams;
  stakingApps: IAccountStakingApp[];
  onViewClick: (id: string) => void;
}

type TProps = IBaseComponentProps & IProps;

export default TProps;
