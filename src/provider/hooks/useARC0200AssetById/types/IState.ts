// types
import type { IARC0200Asset } from '@provider/types';

interface IState {
  asset: IARC0200Asset | null;
  updating: boolean;
}

export default IState;
