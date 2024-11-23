import type { TAccountColors, TAccountIcons } from '@common/types';

interface IExternalAccount {
  color: TAccountColors | null;
  icon: TAccountIcons | null;
  name: string | null;
  publicKey: string;
}

export default IExternalAccount;
