import { useSelector } from 'react-redux';

// types
import type { IRegistrationRootState } from '@provider/types';
export default function useSelectRegistrationImportAccountViaQRCodeOpen(): boolean {
  return useSelector<IRegistrationRootState, boolean>((state) => state.registration.importAccountViaQRCodeModalOpen);
}
