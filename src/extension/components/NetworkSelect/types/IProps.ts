// types
import type { TSizes } from '@common/types';
import type { INetwork, IPropsWithContext } from '@extension/types';

interface IProps extends IPropsWithContext {
  networks: INetwork[];
  onSelect: (value: INetwork) => void;
  size?: TSizes;
  value: INetwork;
}

export default IProps;
