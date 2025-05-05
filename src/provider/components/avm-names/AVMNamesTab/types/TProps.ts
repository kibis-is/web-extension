// types
import type { IBaseComponentProps } from '@common/types';
import type { IAccountInformation, INetworkWithTransactionParams } from '@provider/types';

interface IProps {
  accountInformation: IAccountInformation;
  fetching: boolean;
  network: INetworkWithTransactionParams;
  onViewClick: (id: string) => void;
}

type TProps = IBaseComponentProps & IProps;

export default TProps;
