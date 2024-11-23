// types
import type { IExternalTheme } from '@common/types';

interface IState {
  theme: IExternalTheme | null;
  fetchThemeAction: () => Promise<void>;
}

export default IState;
