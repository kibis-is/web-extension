// enums
import { ConnectionTypeEnum } from '../../../enums';

// types
import type { INetwork } from '@provider/types';

interface IOnConnectParams {
  connectionType: ConnectionTypeEnum;
  network: INetwork;
}

export default IOnConnectParams;
