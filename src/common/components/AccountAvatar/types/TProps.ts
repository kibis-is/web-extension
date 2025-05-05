import type { ResponsiveValue } from '@chakra-ui/react';
import type { Property } from 'csstype';
import type { PropsWithChildren } from 'react';

// types
import type { IBaseComponentProps, IExternalAccount, TSizes } from '@common/types';
import type { IAccountWithExtendedProps } from '@provider/types';

interface IProps {
  account: IAccountWithExtendedProps | IExternalAccount;
  fontFamily?: ResponsiveValue<Property.FontFamily>;
  size?: TSizes;
}
type TProps = IProps & IBaseComponentProps & PropsWithChildren;

export default TProps;
