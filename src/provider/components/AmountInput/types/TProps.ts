import type { NumberInputProps } from '@chakra-ui/react';

// types
import type { IBaseComponentProps } from '@common/types';
import type {
  IAccountWithExtendedProps,
  IAssetTypes,
  INativeCurrency,
  INetworkWithTransactionParams,
} from '@provider/types';
import type IOnEventOptions from './IOnEventOptions';

interface IProps {
  account: IAccountWithExtendedProps;
  asset: IAssetTypes | INativeCurrency;
  id?: string;
  label?: string;
  maximumAmountInAtomicUnits: string;
  network: INetworkWithTransactionParams;
  onMaximumAmountClick: (options: IOnEventOptions) => void;
  required?: boolean;
}
type TProps = IProps & IBaseComponentProps & NumberInputProps;

export default TProps;
