import type { ResponsiveValue } from '@chakra-ui/react';
import type { Property } from 'csstype';

// types
import type { IBaseComponentProps, IExternalAccount, TSizes } from '@common/types';
import type { IAccountWithExtendedProps } from '@provider/types';

interface IProps extends IBaseComponentProps {
  account: IAccountWithExtendedProps | IExternalAccount;
  fontFamily?: ResponsiveValue<Property.FontFamily>;
  size?: TSizes;
  subTextColor?: string;
  textColor?: string;
}

export default IProps;
