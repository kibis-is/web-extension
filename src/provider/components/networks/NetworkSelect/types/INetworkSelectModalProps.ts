// types
import type { IModalProps, INetwork } from '@provider/types';

interface INetworkSelectModalProps extends IModalProps {
  _context: string;
  isOpen: boolean;
  onSelect: (value: INetwork) => void;
  networks: INetwork[];
  selectedGenesisHash: string;
}

export default INetworkSelectModalProps;
