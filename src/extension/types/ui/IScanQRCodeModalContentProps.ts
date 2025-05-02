// types
import type { IBaseComponentProps } from '@common/types';

interface IScanQRCodeModalContentProps extends IBaseComponentProps {
  onPreviousClick: () => void;
  onURI: (uri: string) => void;
  pagination?: [number, number];
}

export default IScanQRCodeModalContentProps;
