// types
import type { ISerializableNetworkWithTransactionParams } from '@provider/repositories/NetworksRepository';
import type {
  IAccount,
  IAccountGroup,
  IActiveAccountDetails,
  IAdvancedSettings,
  IAppearanceSettings,
  IAppWindow,
  IARC0072Asset,
  IARC0200Asset,
  IGeneralSettings,
  IPasskeyCredential,
  IPasswordTag,
  IPrivacySettings,
  IPrivateKey,
  ISecuritySettings,
  ISession,
  IStandardAsset,
  ISystemInfo,
  TEvents,
} from '@provider/types';

type TStorageItemTypes =
  | IAccount
  | IAccountGroup[]
  | IActiveAccountDetails
  | IAdvancedSettings
  | IAppearanceSettings
  | IAppWindow
  | IARC0072Asset[]
  | IARC0200Asset[]
  | IGeneralSettings
  | TEvents[]
  | IPasskeyCredential
  | IPasswordTag
  | IPrivacySettings
  | IPrivateKey
  | ISerializableNetworkWithTransactionParams[]
  | ISecuritySettings
  | ISession
  | IStandardAsset[]
  | ISystemInfo;

export default TStorageItemTypes;
