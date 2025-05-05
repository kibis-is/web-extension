// hooks
import useColorModeValue from '@provider/hooks/useColorModeValue';

export default function useDefaultAvatarBackgroundColor(): string {
  return useColorModeValue('gray.300', 'whiteAlpha.400');
}
