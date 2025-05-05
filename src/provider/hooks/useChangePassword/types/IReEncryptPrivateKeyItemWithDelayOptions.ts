// types
import type { IBaseOptions } from '@common/types';
import type { IPrivateKey } from '@provider/types';

interface IReEncryptPrivateKeyItemWithDelayOptions extends IBaseOptions {
  currentPassword: string;
  delay?: number;
  newPassword: string;
  privateKeyItem: IPrivateKey;
}

export default IReEncryptPrivateKeyItemWithDelayOptions;
