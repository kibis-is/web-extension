// types
import type { IEnVoiHolding, IModalProps, INetworkWithTransactionParams } from '@provider/types';

interface IProps {
  item: IEnVoiHolding | null;
  network: INetworkWithTransactionParams | null;
}

type TProps = IModalProps & IProps;

export default TProps;
