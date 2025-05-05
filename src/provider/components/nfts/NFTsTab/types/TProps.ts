// types
import type { IBaseComponentProps } from '@common/types';
import type { IAccount, INetworkWithTransactionParams } from '@provider/types';

interface IProps {
  account: IAccount;
  fetching: boolean;
  network: INetworkWithTransactionParams;
}

type TProps = IBaseComponentProps & IProps;

export default TProps;
