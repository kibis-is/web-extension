// types
import type { IBaseComponentProps } from '@common/types';
import type {
  IAccountWithExtendedProps,
  INetwork,
  ISystemInfo,
} from '@extension/types';

interface IProps extends IBaseComponentProps {
  account: IAccountWithExtendedProps;
  accounts: IAccountWithExtendedProps[];
  network: INetwork;
  systemInfo: ISystemInfo | null;
}

export default IProps;
