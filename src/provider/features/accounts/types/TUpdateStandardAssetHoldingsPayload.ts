// types
import type { IStandardAsset, TEncryptionCredentials } from '@provider/types';
import type IUpdateAssetHoldingsPayload from './IUpdateAssetHoldingsPayload';

type TUpdateStandardAssetHoldingsPayload = IUpdateAssetHoldingsPayload<IStandardAsset> & TEncryptionCredentials;

export default TUpdateStandardAssetHoldingsPayload;
