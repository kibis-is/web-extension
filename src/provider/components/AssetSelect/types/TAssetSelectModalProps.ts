// types
import type { IBaseComponentProps } from '@common/types';
import type { IAssetTypes, IModalProps, INativeCurrency } from '@provider/types';

interface IAssetSelectModalProps {
  assets: (IAssetTypes | INativeCurrency)[];
  isOpen: boolean;
  multiple?: boolean;
  onSelect: (assets: (IAssetTypes | INativeCurrency)[]) => void;
}

type TAssetSelectModalProps = IAssetSelectModalProps & IBaseComponentProps & IModalProps;

export default TAssetSelectModalProps;
