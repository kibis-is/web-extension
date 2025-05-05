// types
import { IStandardAsset } from '@provider/types';

interface IUseStandardAssetByIdState {
  standardAsset: IStandardAsset | null;
  updating: boolean;
}

export default IUseStandardAssetByIdState;
