// types
import type { TReKeyType } from '@provider/features/re-key-account';
import type { IAccountInformation, IAccountWithExtendedProps, INetworkWithTransactionParams } from '@provider/types';

interface IState {
  account: IAccountWithExtendedProps | null;
  accountInformation: IAccountInformation | null;
  confirming: boolean;
  network: INetworkWithTransactionParams | null;
  type: TReKeyType | null;
}

export default IState;
