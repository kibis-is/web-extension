import {
  ARC0027MethodEnum,
  type TRequestParams,
} from '@agoralabs-sh/avm-web-provider';

// types
import type { IClientInformation } from '@common/types';

interface IPayload<Params extends TRequestParams> {
  clientInfo: IClientInformation;
  method: ARC0027MethodEnum;
  params?: Params;
}

export default IPayload;
