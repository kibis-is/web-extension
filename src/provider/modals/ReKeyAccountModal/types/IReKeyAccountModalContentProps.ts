import type { FocusEvent } from 'react';

// types
import type { IAccountInformation, IAccountWithExtendedProps, INetworkWithTransactionParams } from '@provider/types';

interface IReKeyAccountModalContentProps {
  account: IAccountWithExtendedProps;
  accountInformation: IAccountInformation;
  accounts: IAccountWithExtendedProps[];
  authAddress: string;
  authAddressError: string | null;
  network: INetworkWithTransactionParams;
  onAuthAddressBlur: (event: FocusEvent<HTMLInputElement>) => void;
  onAuthAddressChange: (authAddress: string) => void;
}

export default IReKeyAccountModalContentProps;
