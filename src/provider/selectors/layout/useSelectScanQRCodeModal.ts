import { useSelector } from 'react-redux';

// features
import type { IScanQRCodeModal } from '@provider/features/layout';

// types
import type { IMainRootState } from '@provider/types';

/**
 * Selects the state of the scan QR code modal.
 * @returns {IScanQRCodeModal | null} the scan QR code modal state.
 */
export default function useSelectScanQRCodeModal(): IScanQRCodeModal | null {
  return useSelector<IMainRootState, IScanQRCodeModal | null>((state) => state.layout.scanQRCodeModal);
}
