// types
import type { IAccountWithExtendedProps } from '@extension/types';
import type IConfirmModal from './IConfirmModal';
import type IScanQRCodeModal from './IScanQRCodeModal';

interface IState {
  confirmModal: IConfirmModal | null;
  moveAccountGroupModal: IAccountWithExtendedProps | null;
  scanQRCodeModal: IScanQRCodeModal | null;
  sidebar: boolean;
  whatsNewModal: boolean;
}

export default IState;
