// types
import type { TNotificationType } from '@provider/types';

interface IAddNotificationPayload {
  description?: string;
  ephemeral?: boolean;
  title: string;
  type: TNotificationType;
}

export default IAddNotificationPayload;
