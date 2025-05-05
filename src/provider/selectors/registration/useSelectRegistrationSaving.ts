import { useSelector } from 'react-redux';

// types
import { IRegistrationRootState } from '@provider/types';
export default function useSelectRegistrationSaving(): boolean {
  return useSelector<IRegistrationRootState, boolean>((state) => state.registration.saving);
}
