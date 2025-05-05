import { useSelector } from 'react-redux';

// types
import { IRegistrationRootState } from '@provider/types';
export default function useSelectRegistrationPassword(): string | null {
  return useSelector<IRegistrationRootState, string | null>((state) => state.registration.password);
}
