// types
import type { IBaseComponentProps } from '@common/types';
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
} from '@extension/types';
import type { TReKeyType } from '@extension/features/re-key-account';

interface IConfirmingModalContentProps extends IBaseComponentProps {
  accounts: IAccountWithExtendedProps[];
  currentAddress: string;
  network: INetworkWithTransactionParams;
  reKeyAddress: string;
  reKeyType: TReKeyType;
}

export default IConfirmingModalContentProps;
