// types
import type { IBaseComponentProps } from '@common/types';

interface IProps extends IBaseComponentProps {
  onCancelClick: () => void;
  onScanViaCameraClick: () => void;
  onScanViaScreenCaptureClick: () => void;
  onScanViaTabClick: () => void;
}

export default IProps;
