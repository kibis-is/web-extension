// types
import type { IExternalAccount } from '@common/types';

interface IRegisterResult {
  account: IExternalAccount;
  credential: PublicKeyCredential;
}

export default IRegisterResult;
