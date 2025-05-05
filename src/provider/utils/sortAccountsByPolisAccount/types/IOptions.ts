// types
import type { IAccount } from '@provider/types';

interface IOptions<Type extends IAccount> {
  accounts: Type[];
  polisAccountID: string;
}

export default IOptions;
