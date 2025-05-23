// types
import type { TSizes } from '@common/types';
import type { INetwork } from '@provider/types';

interface IProps {
  network: INetwork;
  size?: TSizes;
}

export default IProps;
