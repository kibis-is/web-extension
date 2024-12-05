// types
import type IBaseMessage from './IBaseMessage';

interface IBaseRequestMessage<Reference = string, Payload = null>
  extends IBaseMessage<Reference> {
  payload: Payload;
}

export default IBaseRequestMessage;
