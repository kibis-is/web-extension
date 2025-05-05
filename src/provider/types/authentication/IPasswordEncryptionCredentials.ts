// enums
import { EncryptionMethodEnum } from '@provider/enums';

interface IPasswordEncryptionCredentials {
  password: string;
  type: EncryptionMethodEnum.Password;
}

export default IPasswordEncryptionCredentials;
