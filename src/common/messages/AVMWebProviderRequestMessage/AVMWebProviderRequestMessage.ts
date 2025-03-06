import type { TRequestParams } from '@agoralabs-sh/avm-web-provider';

// enums
import { AVMWebProviderMessageReferenceEnum } from '@common/enums';

// types
import type { IBaseRequestMessage } from '@common/types';
import type { IPayload } from './types';

export default class AVMWebProviderRequestMessage<Params extends TRequestParams>
  implements
    IBaseRequestMessage<
      AVMWebProviderMessageReferenceEnum.Request,
      IPayload<Params>
    >
{
  public readonly id: string;
  public readonly payload: IPayload<Params>;
  public readonly reference: AVMWebProviderMessageReferenceEnum.Request;

  constructor({
    id,
    payload,
    reference,
  }: IBaseRequestMessage<
    AVMWebProviderMessageReferenceEnum.Request,
    IPayload<Params>
  >) {
    this.id = id;
    this.payload = payload;
    this.reference = reference;
  }
}
