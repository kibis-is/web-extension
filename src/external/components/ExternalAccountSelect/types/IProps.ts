import type { ResponsiveValue } from '@chakra-ui/react';
import type { Property } from 'csstype';

// types
import type { IBaseComponentProps, IExternalAccount } from '@common/types';

interface IProps extends IBaseComponentProps {
  accounts: IExternalAccount[];
  disabled?: boolean;
  fontFamily?: ResponsiveValue<Property.FontFamily>;
  onSelect: (account: IExternalAccount) => void;
  selectModalTitle?: string;
  value: IExternalAccount | null;
}

export default IProps;
