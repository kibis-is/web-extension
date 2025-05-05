import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@provider/types';

export default function useSelectSendAssetConfirming(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.sendAssets.confirming);
}
