// types
import type { TSizes } from '@common/types';

interface IProps {
  names: string[];
  onSelect: (index: number) => void;
  selectedIndex: number;
  size?: TSizes;
}

export default IProps;
