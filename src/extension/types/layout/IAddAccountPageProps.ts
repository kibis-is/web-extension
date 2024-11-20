// types
import type INewAccountWithKeyPair from '../accounts/INewAccountWithKeyPair';

interface IProps {
  onComplete: (account: INewAccountWithKeyPair) => Promise<void>;
  saving: boolean;
}

export default IProps;
