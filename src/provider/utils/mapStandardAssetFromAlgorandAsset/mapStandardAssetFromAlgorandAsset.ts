import { BigNumber } from 'bignumber.js';

// enums
import { AssetTypeEnum } from '@provider/enums';

// types
import { IAVMAsset, IStandardAsset } from '@provider/types';

export default function mapStandardAssetFromAlgorandAsset(
  algorandAsset: IAVMAsset,
  iconUrl: string | null,
  verified: boolean
): IStandardAsset {
  return {
    clawbackAddress: algorandAsset.params.clawback || null,
    creator: algorandAsset.params.creator,
    decimals: new BigNumber(String(algorandAsset.params.decimals as bigint)).toNumber(),
    defaultFrozen: algorandAsset.params['default-frozen'] || false,
    deleted: algorandAsset.deleted || false,
    freezeAddress: algorandAsset.params.freeze || null,
    iconUrl,
    id: new BigNumber(String(algorandAsset.index as bigint)).toFixed(),
    managerAddress: algorandAsset.params.manager || null,
    metadataHash: algorandAsset.params['metadata-hash'] || null,
    name: algorandAsset.params.name || null,
    nameBase64: algorandAsset.params['name-b64'] || null,
    reserveAddress: algorandAsset.params.reserve || null,
    totalSupply: new BigNumber(String(algorandAsset.params.total as bigint)).toFixed(),
    type: AssetTypeEnum.Standard,
    unitName: algorandAsset.params['unit-name'] || null,
    unitNameBase64: algorandAsset.params['unit-name-b64'] || null,
    url: algorandAsset.params.url || null,
    urlBase64: algorandAsset.params['url-b64'] || null,
    verified,
  };
}
