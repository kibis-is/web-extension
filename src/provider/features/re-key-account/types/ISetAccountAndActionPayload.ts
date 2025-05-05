// types
import type { IAccountWithExtendedProps } from '@provider/types';
import type TReKeyType from './TReKeyType';

interface ISetAccountAndActionPayload {
  account: IAccountWithExtendedProps;
  type: TReKeyType;
}

export default ISetAccountAndActionPayload;
