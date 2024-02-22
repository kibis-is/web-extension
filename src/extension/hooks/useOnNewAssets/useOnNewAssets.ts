import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// features
import { updateARC0200AssetInformationThunk } from '@extension/features/arc200-assets';
import { updateStandardAssetInformationThunk } from '@extension/features/standard-assets';

// selectors
import {
  useSelectAccounts,
  useSelectARC0200AssetsBySelectedNetwork,
  useSelectSelectedNetwork,
  useSelectStandardAssetsBySelectedNetwork,
} from '@extension/selectors';

// types
import {
  IAccount,
  IAccountInformation,
  IAppThunkDispatch,
  IARC0200Asset,
  IARC0200AssetHolding,
  INetwork,
  IStandardAsset,
  IStandardAssetHolding,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

/**
 * Checks for changes in the accounts and gets new asset information if any new assets.
 */
export default function useOnNewAssets(): void {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const arc200Assets: IARC0200Asset[] =
    useSelectARC0200AssetsBySelectedNetwork();
  const standardAssets: IStandardAsset[] =
    useSelectStandardAssetsBySelectedNetwork();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();

  // check for any new arc200 assets
  useEffect(() => {
    if (accounts.length > 0 && arc200Assets && selectedNetwork) {
      accounts.forEach((account) => {
        const encodedGenesisHash: string = convertGenesisHashToHex(
          selectedNetwork.genesisHash
        ).toUpperCase();
        const accountInformation: IAccountInformation | null =
          account.networkInformation[encodedGenesisHash] || null;
        let newARC0200AssetHoldings: IARC0200AssetHolding[];

        if (accountInformation) {
          // filter out any new arc200 assets
          newARC0200AssetHoldings =
            accountInformation.arc200AssetHoldings.filter(
              (assetHolding) =>
                !arc200Assets.some((value) => value.id === assetHolding.id)
            );

          // if we have any new arc200 assets, update the information
          if (newARC0200AssetHoldings.length > 0) {
            dispatch(
              updateARC0200AssetInformationThunk({
                ids: newARC0200AssetHoldings.map((value) => value.id),
                network: selectedNetwork,
              })
            );
          }
        }
      });
    }
  }, [accounts]);

  // check for any new standard assets
  useEffect(() => {
    if (accounts.length > 0 && standardAssets && selectedNetwork) {
      accounts.forEach((account) => {
        const encodedGenesisHash: string = convertGenesisHashToHex(
          selectedNetwork.genesisHash
        ).toUpperCase();
        const accountInformation: IAccountInformation | null =
          account.networkInformation[encodedGenesisHash] || null;
        let newStandardAssetHoldings: IStandardAssetHolding[];

        if (accountInformation) {
          // filter out any new standard assets
          newStandardAssetHoldings =
            accountInformation.standardAssetHoldings.filter(
              (assetHolding) =>
                !standardAssets.some((value) => value.id === assetHolding.id)
            );

          // if we have any new standard assets, update the information
          if (newStandardAssetHoldings.length > 0) {
            dispatch(
              updateStandardAssetInformationThunk({
                ids: newStandardAssetHoldings.map((value) => value.id),
                network: selectedNetwork,
              })
            );
          }
        }
      });
    }
  }, [accounts]);
}