// types
import type { TAccountColors, TAccountIcons } from '@common/types';

interface ISaveAccountDetailsPayload {
  accountId: string;
  color: TAccountColors | null;
  icon: TAccountIcons | null;
  name: string;
}

export default ISaveAccountDetailsPayload;
