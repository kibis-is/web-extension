// types
import type { TNotificationType } from '@provider/types';

interface IProps {
  description?: string;
  title: string;
  onClose: () => void;
  type?: TNotificationType;
}

export default IProps;
