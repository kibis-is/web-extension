import type { ResponsiveValue } from '@chakra-ui/react';
import type { Property } from 'csstype';

// types
import type { IBaseComponentProps, IExternalAccount } from '@common/types';
import type { IModalProps } from '@extension/types';

interface IExternalAccountSelectModalProps {
  accounts: IExternalAccount[];
  fontFamily?: ResponsiveValue<Property.FontFamily>;
  isOpen: boolean;
  onSelect: (accounts: IExternalAccount) => void;
  title?: string;
}

type TProps = IExternalAccountSelectModalProps &
  IBaseComponentProps &
  IModalProps;

export default TProps;
