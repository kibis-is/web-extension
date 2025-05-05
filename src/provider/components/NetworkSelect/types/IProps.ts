// types
import type { TSizes } from '@common/types';
import type { INetwork } from '@provider/types';

interface IProps {
  networks: INetwork[];
  onSelect: (value: INetwork) => void;
  size?: TSizes;
  value: INetwork;
}

export default IProps;
