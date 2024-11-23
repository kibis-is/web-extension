import { useMediaQuery } from '@chakra-ui/react';

export default function useTabletAndUp(): boolean {
  return useMediaQuery('(min-width: 768px)')[0];
}
