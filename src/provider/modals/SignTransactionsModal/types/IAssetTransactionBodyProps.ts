// types
import type { IStandardAsset } from '@provider/types';
import type ITransactionBodyProps from './ITransactionBodyProps';

interface IAssetTransactionBodyProps extends ITransactionBodyProps {
  asset: IStandardAsset | null;
}

export default IAssetTransactionBodyProps;
