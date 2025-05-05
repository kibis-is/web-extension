import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// features
import { setLogger } from '@provider/features/system';

// selectors
import { useSelectSettingsDebugLogging } from '@provider/selectors';

// types
import type { IBackgroundRootState, IAppThunkDispatch, IMainRootState } from '@provider/types';

// utils
import createLogger from '@common/utils/createLogger';

export default function useOnDebugLogging(): void {
  const dispatch = useDispatch<IAppThunkDispatch<IBackgroundRootState | IMainRootState>>();
  // hooks
  const debugLogging = useSelectSettingsDebugLogging();

  // if the debug logging is turned on, force debug logging by updating the system wide logger
  useEffect(() => {
    let logger = createLogger(__ENV__ === 'development' ? 'debug' : 'error'); // if we are in a dev environment, logging is always on

    if (debugLogging) {
      logger = createLogger('debug');
    }

    dispatch(setLogger(logger));
  }, [debugLogging]);
}
