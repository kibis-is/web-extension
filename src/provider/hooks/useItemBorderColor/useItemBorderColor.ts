// hooks
import useColorModeValue from '@provider/hooks/useColorModeValue';

export default function useItemBorderColor(): string {
  return useColorModeValue('gray.100', 'whiteAlpha.100');
}
