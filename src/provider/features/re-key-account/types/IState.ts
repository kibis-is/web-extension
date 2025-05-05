// types
import type { IAccountWithExtendedProps } from '@provider/types';
import type TReKeyType from './TReKeyType';

interface IState {
  account: IAccountWithExtendedProps | null;
  confirming: boolean;
  type: TReKeyType | null;
}

export default IState;
