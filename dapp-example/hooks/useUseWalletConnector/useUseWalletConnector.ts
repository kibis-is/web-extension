import type {
  IARC0001Transaction,
  BaseARC0027Error,
} from '@agoralabs-sh/avm-web-provider';
import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import {
  WalletId,
  type WalletAccount,
  WalletManager,
} from '@txnlab/use-wallet';
import { useMemo, useState } from 'react';

// selectors
import { useSelectLogger } from '../../selectors';

// types
import type { INetwork, INode } from '@extension/types';
import type {
  IAccountInformation,
  IConnectorParams,
  IConnectorState,
} from '../../types';

// utils
import getRandomItem from '@common/utils/getRandomItem';
import { getAccountInformation } from '../../utils';

export default function useUseWalletConnector({
  toast,
}: IConnectorParams): IConnectorState {
  // memos
  const __hook = useMemo(() => 'useUseWalletConnector', []);
  // selectors
  const logger = useSelectLogger();
  // states
  const [enabledAccounts, setEnabledAccounts] = useState<IAccountInformation[]>(
    []
  );
  const [walletManager, setWalletManager] = useState<WalletManager | null>(
    null
  );
  // actions
  const connectAction = async (network: INetwork) => {
    const __function = 'connectAction';
    const algod = getRandomItem<INode>(network.algods);
    const _walletManager = new WalletManager({
      algod: {
        port: algod.port || '',
        token: algod.token || '',
        baseServer: algod.url,
      },
      wallets: [WalletId.KIBISIS],
    });
    const wallet =
      _walletManager.wallets.find((value) => value.id === WalletId.KIBISIS) ||
      null;
    let walletAccounts: WalletAccount[];

    if (!wallet) {
      logger.error(
        `${__hook}#${__function}: failed to get kibisis wallet in use-wallet`
      );

      toast({
        description: 'Check browser console for more information.',
        status: 'error',
        title: 'Failed to Initialize UseWallet',
      });

      return false;
    }

    try {
      walletAccounts = await wallet.connect();
    } catch (error) {
      logger.error(`${__hook}#${__function}:`, error);

      if ((error as BaseARC0027Error).code) {
        toast({
          description: (error as BaseARC0027Error).message,
          status: 'error',
          title: `${(error as BaseARC0027Error).code}: ${
            (error as BaseARC0027Error).name
          }`,
        });
      }

      return false;
    }

    try {
      setEnabledAccounts(
        await Promise.all(
          walletAccounts.map<Promise<IAccountInformation>>(
            ({ address, name }) =>
              getAccountInformation({ address, name }, network)
          )
        )
      );
    } catch (error) {
      logger.error(`${__hook}#${__function}:`, error);

      toast({
        description: 'Check browser console for more information.',
        status: 'error',
        title: 'Failed To Get Account Information',
      });

      return false;
    }

    setWalletManager(_walletManager);

    toast({
      description: `Successfully connected via UseWallet.`,
      status: 'success',
      title: 'Connected!',
    });

    return true;
  };
  const disconnectAction = async () => {
    const __function = 'disconnectAction';
    const wallet =
      walletManager?.wallets.find((value) => value.id === WalletId.KIBISIS) ||
      null;

    setEnabledAccounts([]);

    if (!wallet) {
      logger.error(
        `${__hook}#${__function}: failed to get wallet from use-wallet wallet manager`
      );

      return;
    }

    await wallet.disconnect();

    toast({
      description: `Successfully disconnected via UseWallet.`,
      status: 'success',
      title: 'Disconnected!',
    });
  };
  const signMessageAction = () => {
    toast({
      description: `UseWallet does not support signing of messages.`,
      status: 'error',
      title: 'Not Supported!',
    });

    throw new Error(`signing a message not supported by use-wallet`);
  };
  const signTransactionsAction = async (
    transactions: IARC0001Transaction[]
  ) => {
    const __function = 'disconnectAction';
    const wallet =
      walletManager?.wallets.find((value) => value.id === WalletId.KIBISIS) ||
      null;
    let result: (Uint8Array | null)[];

    if (!wallet) {
      logger.error(
        `${__hook}#${__function}: failed to get wallet from use-wallet wallet manager`
      );

      return [];
    }

    result = await wallet.signTransactions(
      transactions.map(({ txn }) => decodeBase64(txn))
    );

    return result.map((value) =>
      value !== null ? encodeBase64(value) : value
    );
  };

  return {
    connectAction,
    disconnectAction,
    enabledAccounts,
    signMessageAction,
    signTransactionsAction,
  };
}
