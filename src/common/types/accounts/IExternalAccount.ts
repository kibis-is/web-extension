import type { TAccountColors, TAccountIcons } from '@common/types';

interface IExternalAccount {
  color: TAccountColors | null;
  icon: TAccountIcons | null;
  isWatchAccount: boolean;
  name: string | null;
  publicKey: string;
}

export default IExternalAccount;
