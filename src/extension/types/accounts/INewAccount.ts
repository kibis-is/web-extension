// cryptography
import Ed21559KeyPair from '@extension/cryptography/Ed21559KeyPair';

interface INewAccount {
  keyPair: Ed21559KeyPair;
  name: string | null;
}

export default INewAccount;
