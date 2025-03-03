// types
import type { IExternalAccount } from '@common/types';

interface IResult {
  account: IExternalAccount;
  credential: PublicKeyCredential;
}

export default IResult;
