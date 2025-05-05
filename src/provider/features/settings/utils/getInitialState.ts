// repositories
import SettingsRepository from '@provider/repositories/SettingsRepository';

// types
import type { IState } from '../types';

export default function getInitialState(): IState {
  return {
    ...SettingsRepository.initializeDefaultSettings(),
    fetching: false,
    saving: false,
  };
}
