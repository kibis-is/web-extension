// cryptography
import Ed21559KeyPair from '@provider/cryptography/Ed21559KeyPair';

interface INewAccount {
  keyPair: Ed21559KeyPair;
  name: string | null;
}

export default INewAccount;
