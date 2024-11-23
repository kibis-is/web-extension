import { useCallback, useMemo, useState } from 'react';

// managers
import WebAuthnMessageManager from '@external/managers/WebAuthnMessageManager';

// types
import type { IExternalTheme } from '@common/types';
import type { IOptions, IState } from './types';

export default function useTheme({ logger }: IOptions = {}): IState {
  const _hooksName = 'useTheme';
  // memos
  const webAuthnMessageManager = useMemo(
    () =>
      new WebAuthnMessageManager({
        logger,
      }),
    []
  );
  // states
  const [theme, setTheme] = useState<IExternalTheme | null>(null);
  // actions
  const fetchThemeAction = useCallback(async () => {
    let _theme: IExternalTheme | null;

    try {
      _theme = await webAuthnMessageManager.fetchTheme();

      setTheme(_theme);
    } catch (error) {
      logger?.error(`${_hooksName}:`, error);
    }
  }, []);

  return {
    theme,
    fetchThemeAction,
  };
}
