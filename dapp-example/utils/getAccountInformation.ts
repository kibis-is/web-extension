import { IAccount } from '@agoralabs-sh/avm-web-provider';
import { Algodv2, IntDecoding } from 'algosdk';
import BigNumber from 'bignumber.js';

// types
import { IAVMAccountInformation, IAVMAsset, INetwork } from '@provider/types';
import { IAccountInformation, IAssetInformation } from '../types';

// utils
import getRandomAlgodClient from './getRandomAlgodClient';

export default async function getAccountInformation(
  account: IAccount,
  network: INetwork
): Promise<IAccountInformation> {
  const client: Algodv2 = getRandomAlgodClient(network);
  const accountInformation: IAVMAccountInformation = (await client
    .accountInformation(account.address)
    .setIntDecoding(IntDecoding.BIGINT)
    .do()) as IAVMAccountInformation;
  const assets: IAssetInformation[] = await Promise.all(
    accountInformation.assets.map<Promise<IAssetInformation>>(
      (value, index) =>
        new Promise((resolve, reject) =>
          setTimeout(async () => {
            let assetInformation: IAVMAsset;

            try {
              assetInformation = (await client
                .getAssetByID(Number(value['asset-id']))
                .setIntDecoding(IntDecoding.BIGINT)
                .do()) as IAVMAsset;

              resolve({
                balance: new BigNumber(String(value.amount)),
                decimals: Number(assetInformation.params.decimals),
                id: String(assetInformation.index),
                name: assetInformation.params.name || null,
                symbol: assetInformation.params['unit-name'] || null,
              });
            } catch (error) {
              reject(error);
            }
          }, 100 + index)
        )
    )
  );

  return {
    address: account.address,
    name: account.name || null,
    assets,
    balance: new BigNumber(String(accountInformation.amount)),
  };
}
