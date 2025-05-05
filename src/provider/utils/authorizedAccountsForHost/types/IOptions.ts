// types
import type { IAccountWithExtendedProps, ISession } from '@provider/types';

interface IOptions {
  accounts: IAccountWithExtendedProps[];
  host: string;
  sessions: ISession[];
}

export default IOptions;
