import type { PropsWithChildren } from 'react';

// types
import type { IBaseComponentProps, IExternalAccount } from '@common/types';
import type { IAccountWithExtendedProps } from '@extension/types';

interface IProps {
  account: IAccountWithExtendedProps | IExternalAccount;
}
type TProps = IProps & IBaseComponentProps & PropsWithChildren;

export default TProps;
