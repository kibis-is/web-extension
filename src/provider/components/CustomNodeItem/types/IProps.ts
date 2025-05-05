// types
import type { ICustomNode } from '@provider/types';

interface IProps {
  item: ICustomNode;
  isActivated: boolean;
  onActivate: (id: string) => void;
  onDeactivate: () => void;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
}

export default IProps;
