// types
import type { IState } from '../types';

export default function getInitialState(): IState {
  return {
    confirmModal: null,
    moveAccountGroupModal: null,
    scanQRCodeModal: null,
    sidebar: false,
    whatsNewModal: false,
  };
}
