import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@provider/types';

export default function useSelectIsOnline(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.system.networkConnectivity.online);
}
