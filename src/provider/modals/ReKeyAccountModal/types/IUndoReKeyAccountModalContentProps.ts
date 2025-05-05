// types
import type { IAccountWithExtendedProps, INetworkWithTransactionParams } from '@provider/types';

interface IUndoReKeyAccountModalContentProps {
  account: IAccountWithExtendedProps;
  accounts: IAccountWithExtendedProps[];
  authAddress: string;
  network: INetworkWithTransactionParams;
}

export default IUndoReKeyAccountModalContentProps;
