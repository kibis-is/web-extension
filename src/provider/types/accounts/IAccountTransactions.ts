// types
import type { ITransactions } from '@provider/types';

/**
 * @property {string | null} next - the token for the next page of results.
 * @property {ITransactions[]} transactions - the current transactions.
 */
interface IAccountTransactions {
  next: string | null;
  transactions: ITransactions[];
}

export default IAccountTransactions;
