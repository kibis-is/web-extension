// types
import type { IBaseComponentProps } from '@common/types';
import type { IAccountWithExtendedProps, INetworkWithTransactionParams } from '@provider/types';

interface IProps {
  account: IAccountWithExtendedProps;
  network: INetworkWithTransactionParams;
  subTextColor?: string;
  textColor?: string;
}

type TProps = IBaseComponentProps & IProps;

export default TProps;
