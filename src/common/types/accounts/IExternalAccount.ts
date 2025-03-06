import type { TAccountColors, TAccountIcons } from '@common/types';

interface IExternalAccount {
  color?: TAccountColors;
  icon?: TAccountIcons;
  name?: string;
  publicKey: string;
}

export default IExternalAccount;
