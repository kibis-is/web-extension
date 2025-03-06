// types
import type { IBaseOptions } from '@common/types';

interface IOptions<Message, Reference = string> extends IBaseOptions {
  delay?: number;
  message: Message;
  responseReference: Reference;
}

export default IOptions;
