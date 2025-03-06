// types
import type { IExternalTheme } from '@common/types';

interface IExternalConfig {
  allowAccountPasskeys: boolean;
  debugLogging: boolean;
  isInitialized: boolean;
  theme: IExternalTheme;
}

export default IExternalConfig;
