// features
import type { IState as IARC0200AssetsState } from '@extension/features/arc0200-assets';
import type { IState as ILayoutState } from '@extension/features/layout';
import type { IState as ISettingsState } from '@extension/features/settings';
import type { IState as ISystemState } from '@extension/features/system';

interface IBaseRootState {
  arc0200Assets: IARC0200AssetsState;
  layout: ILayoutState;
  settings: ISettingsState;
  system: ISystemState;
}

export default IBaseRootState;
