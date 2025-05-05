// types
import type { TSizes } from '@common/types';

export default function parseIconSize(size: TSizes): number {
  switch (size) {
    case 'lg':
      return 6;
    case 'md':
      return 4;
    case 'xs':
      return 2;
    case 'sm':
    default:
      return 3;
  }
}
