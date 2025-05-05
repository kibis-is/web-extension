// types
import type ISCSAccount from './ISCSAccount';

interface ISCSAccountResponse {
  accounts: ISCSAccount[];
  ['current-round']: number;
  ['next-token']: number;
}

export default ISCSAccountResponse;
