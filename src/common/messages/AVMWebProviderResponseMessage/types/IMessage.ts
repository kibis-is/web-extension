import {
  ARC0027MethodEnum,
  BaseARC0027Error,
} from '@agoralabs-sh/avm-web-provider';

// enums
import { AVMWebProviderMessageReferenceEnum } from '@common/enums';

// types
import type { IBaseResponseMessage } from '@common/types';

interface IMessage<Result>
  extends IBaseResponseMessage<
    Result,
    BaseARC0027Error,
    AVMWebProviderMessageReferenceEnum.Response
  > {
  method: ARC0027MethodEnum;
}

export default IMessage;
