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
    AVMWebProviderMessageReferenceEnum.Response,
    BaseARC0027Error
  > {
  method: ARC0027MethodEnum;
}

export default IMessage;
