// enums
import { AVMNameTypeEnum } from '@provider/enums';

// types
import type { IBaseComponentProps } from '@common/types';

interface IProps {
  size?: string;
  type: AVMNameTypeEnum;
}

type TProps = IBaseComponentProps & IProps;

export default TProps;
