// enums
import { DelimiterEnum } from '@extension/enums';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

interface INewAccountWithKeyPair {
  __delimiter: DelimiterEnum.KeyPair;
  keyPair: Ed21559KeyPair;
  name: string | null;
}

export default INewAccountWithKeyPair;
