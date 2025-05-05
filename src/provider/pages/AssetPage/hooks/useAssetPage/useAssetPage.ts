import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';

// enums
import { AssetTypeEnum } from '@provider/enums';

// selectors
import {
  useSelectActiveAccount,
  useSelectActiveAccountInformation,
  useSelectARC0200AssetsBySelectedNetwork,
  useSelectStandardAssetsBySelectedNetwork,
} from '@provider/selectors';

// types
import type { IARC0200AssetHolding, IAssetTypes, IStandardAssetHolding } from '@provider/types';
import type { IUseAssetPageOptions, IUseAssetPageState } from './types';

// utils
import convertToStandardUnit from '@common/utils/convertToStandardUnit';

export default function useAssetPage({ assetId }: IUseAssetPageOptions): IUseAssetPageState {
  // selectors
  const account = useSelectActiveAccount();
  const accountInformation = useSelectActiveAccountInformation();
  const arc200Assets = useSelectARC0200AssetsBySelectedNetwork();
  const standardAssets = useSelectStandardAssetsBySelectedNetwork();
  // state
  const [asset, setAsset] = useState<IAssetTypes | null>(null);
  const [assetHolding, setAssetHolding] = useState<IARC0200AssetHolding | IStandardAssetHolding | null>(null);
  const [amountInStandardUnits, setAmountInStandardUnits] = useState<BigNumber>(new BigNumber('0'));

  // 1. when we have the asset id and the assets, get the asset
  useEffect(() => {
    let selectedAsset: IAssetTypes | null;

    if (assetId) {
      // first, find amongst the arc200 assets
      selectedAsset = arc200Assets.find((value) => value.id === assetId) || null;

      // if there is not an arc200 asset, it maybe a standard asset
      if (!selectedAsset) {
        selectedAsset = standardAssets.find((value) => value.id === assetId) || null;
      }

      setAsset(selectedAsset);
    }
  }, [arc200Assets, assetId, standardAssets]);
  // 2. when we have the asset and the account information, get the asset holding
  useEffect(() => {
    let selectedAssetHolding: IARC0200AssetHolding | IStandardAssetHolding | null;

    if (asset && accountInformation) {
      switch (asset.type) {
        case AssetTypeEnum.ARC0200:
          selectedAssetHolding = accountInformation.arc200AssetHoldings.find((value) => value.id === assetId) || null;
          break;
        case AssetTypeEnum.Standard:
          selectedAssetHolding = accountInformation.standardAssetHoldings.find((value) => value.id === assetId) || null;
          break;
        default:
          selectedAssetHolding = null;
          break;
      }

      setAssetHolding(selectedAssetHolding);
    }
  }, [asset, accountInformation]);
  // 3. when we have the asset and asset holding, update the standard amount
  useEffect(() => {
    if (asset && assetHolding) {
      setAmountInStandardUnits(convertToStandardUnit(new BigNumber(assetHolding.amount), asset.decimals));
    }
  }, [asset, assetHolding]);

  return {
    account,
    accountInformation,
    amountInStandardUnits,
    asset,
    assetHolding,
  };
}
