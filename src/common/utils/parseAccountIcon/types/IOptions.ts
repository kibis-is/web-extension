import type { TAccountIcons } from '@common/types';
import type { TSizes } from '@common/types';

interface IOptions {
  accountIcon: TAccountIcons | null;
  color?: string;
  size?: TSizes;
}

export default IOptions;
