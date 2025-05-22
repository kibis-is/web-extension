// types
import type { IBaseComponentProps } from '@common/types';
import type { IEnVoiHolding } from '@provider/types';

interface IProps {
  item: IEnVoiHolding;
  onViewClick: (id: string) => void;
}

type TItemProps = IBaseComponentProps & IProps;

export default TItemProps;
