// types
import type { IModalProps, ISignTransactionState } from '@extension/types';

interface IProps extends IModalProps {
  signedTransactionStates: ISignTransactionState[];
}

export default IProps;
