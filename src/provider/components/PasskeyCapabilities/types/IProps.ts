// types
import type { TSizes } from '@common/types';

interface IProps {
  capabilities: AuthenticatorTransport[];
  size?: TSizes;
}

export default IProps;
