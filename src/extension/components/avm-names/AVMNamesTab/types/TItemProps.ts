// types
import type { IBaseComponentProps } from '@common/types';
import type { IARC0072AssetHolding } from '@extension/types';

interface IProps {
  item: IARC0072AssetHolding;
  onViewClick: (id: string) => void;
}

type TItemProps = IBaseComponentProps & IProps;

export default TItemProps;
