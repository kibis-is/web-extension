// types
import type { INetwork, ISession } from '@provider/types';

interface IProps {
  item: ISession;
  network: INetwork;
  onDisconnect: (id: string) => void;
  onSelect: (id: string) => void;
}

export default IProps;
