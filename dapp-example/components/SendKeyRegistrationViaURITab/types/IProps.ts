// types
import type { INetwork } from '@provider/types';
import type { IAccountInformation } from '../../../types';

interface IProps {
  account: IAccountInformation | null;
  network: INetwork | null;
}

export default IProps;
