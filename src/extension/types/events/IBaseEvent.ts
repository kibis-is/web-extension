// enums
import { EventTypeEnum } from '@extension/enums';

interface IBaseEvent<Payload, Type = EventTypeEnum> {
  id: string;
  payload: Payload;
  type: Type;
}

export default IBaseEvent;
