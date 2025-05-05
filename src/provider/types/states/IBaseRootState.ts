// features
import type { IState as IARC0200AssetsState } from '@provider/features/arc0200-assets';
import type { IState as ILayoutState } from '@provider/features/layout';
import type { IState as ISettingsState } from '@provider/features/settings';
import type { IState as ISystemState } from '@provider/features/system';

interface IBaseRootState {
  arc0200Assets: IARC0200AssetsState;
  layout: ILayoutState;
  settings: ISettingsState;
  system: ISystemState;
}

export default IBaseRootState;
