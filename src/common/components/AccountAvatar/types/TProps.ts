import type { PropsWithChildren } from 'react';

// types
import type { IAccountWithExtendedProps } from '@extension/types';
import type { IBaseComponentProps } from '@common/types';

interface IProps {
  account: IAccountWithExtendedProps;
}
type TProps = IProps & IBaseComponentProps & PropsWithChildren;

export default TProps;
