// types
import type { IBaseComponentProps } from '@common/types';
import type { IAccountWithExtendedProps } from '@provider/types';

interface IProps extends IBaseComponentProps {
  account: IAccountWithExtendedProps;
  fetching: boolean;
  onRemoveClick: (id: string) => void;
  onViewClick: (id: string) => void;
}

export default IProps;
