// types
import type { IBaseComponentProps, IExternalAccount } from '@common/types';
import type { IModalProps } from '@extension/types';

interface IExternalAccountSelectModalProps {
  accounts: IExternalAccount[];
  isOpen: boolean;
  onSelect: (accounts: IExternalAccount) => void;
  title?: string;
}

type TExternalAccountSelectModalProps = IExternalAccountSelectModalProps &
  IBaseComponentProps &
  IModalProps;

export default TExternalAccountSelectModalProps;
