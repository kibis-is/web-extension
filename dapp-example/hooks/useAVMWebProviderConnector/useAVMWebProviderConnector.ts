import {
  ARC0027MethodEnum,
  ARC0027MethodTimedOutError,
  AVMWebClient,
  IARC0001Transaction,
  UPPER_REQUEST_TIMEOUT,
} from '@agoralabs-sh/avm-web-provider';
import { useState } from 'react';

// types
import type { INetwork } from '@extension/types';
import type {
  IAccountInformation,
  IConnectorParams,
  IConnectorState,
  ISignMessageActionResult,
} from '../../types';

// utils
import { getAccountInformation } from '../../utils';

export default function useAVMWebProviderConnector({
  toast,
}: IConnectorParams): IConnectorState {
  const __hook = 'useAVMWebProviderConnector';
  // state
  const [enabledAccounts, setEnabledAccounts] = useState<IAccountInformation[]>(
    []
  );
  const [avmWebClient, setAVMWebClient] = useState<AVMWebClient | null>(null);
  // actions
  const connectAction = (network: INetwork) => {
    const __function = 'connectAction';

    return new Promise<boolean>((resolve, reject) => {
      const _avmWebClient = getOrInitializeAVMWebClient();
      const listenerId = _avmWebClient.onEnable(async ({ error, result }) => {
        // remove the listener, it is not needed
        _avmWebClient.removeListener(listenerId);

        if (error) {
          console.error(error.message);

          toast({
            description: error.message,
            status: 'error',
            title: 'Failed To Connect',
          });

          return resolve(false);
        }

        if (!result) {
          console.error(
            `${__hook}#${__function}: no result returned from enable request`
          );

          return resolve(false);
        }

        try {
          setEnabledAccounts(
            await Promise.all(
              result.accounts.map<Promise<IAccountInformation>>(
                ({ address, name }) =>
                  getAccountInformation({ address, name }, network)
              )
            )
          );
        } catch (error) {
          console.error(`${__hook}#${__function}:`, error);

          toast({
            status: 'error',
            title: 'Failed to get account information for connected wallets',
          });

          return resolve(false);
        }

        toast({
          description: `Successfully connected via AVM Web Provider.`,
          status: 'success',
          title: 'Connected!',
        });

        return resolve(true);
      });

      _avmWebClient.enable({
        genesisHash: network.genesisHash,
        providerId: __PROVIDER_ID__,
      });
    });
  };
  const disconnectAction = () => {
    let _avmWebClient = getOrInitializeAVMWebClient();
    let listenerId = _avmWebClient.onDisable(({ error }) => {
      // remove the listener, it is not needed
      _avmWebClient.removeListener(listenerId);

      if (error) {
        toast({
          description: error.message,
          status: 'error',
          title: 'Failed To Disconnect',
        });

        return;
      }

      setEnabledAccounts([]);

      toast({
        description: `Successfully disconnected via AVM Web Provider.`,
        status: 'success',
        title: 'Disconnected!',
      });
    });

    _avmWebClient.disable({
      providerId: __PROVIDER_ID__,
    });
  };
  const signMessageAction = (
    message: string,
    signer?: string
  ): Promise<ISignMessageActionResult> => {
    return new Promise<ISignMessageActionResult>((resolve, reject) => {
      let _avmWebClient = getOrInitializeAVMWebClient();
      let listenerId: string;
      let timeoutId = window.setTimeout(() => {
        const error = new ARC0027MethodTimedOutError({
          method: ARC0027MethodEnum.SignTransactions,
          providerId: __PROVIDER_ID__,
        });

        toast({
          description: error.message,
          status: 'error',
          title: 'Sign Message Request Timeout',
        });

        // remove the listener, it is not needed
        if (listenerId) {
          _avmWebClient.removeListener(listenerId);
        }

        return reject(error);
      }, UPPER_REQUEST_TIMEOUT);
      listenerId = _avmWebClient.onSignMessage(({ error, result }) => {
        // remove the listener, it is not needed
        _avmWebClient.removeListener(listenerId);

        if (error) {
          toast({
            description: error.message,
            status: 'error',
            title: 'Failed To Sign Message',
          });

          window.clearTimeout(timeoutId);

          return reject(error);
        }

        if (result) {
          window.clearTimeout(timeoutId);

          return resolve({
            signature: result.signature,
            signer: result.signer,
          });
        }
      });

      _avmWebClient.signMessage({
        message,
        providerId: __PROVIDER_ID__,
        signer,
      });
    });
  };
  const signTransactionsAction = async (
    transactions: IARC0001Transaction[]
  ) => {
    return new Promise<(string | null)[]>((resolve, reject) => {
      let _avmWebClient = getOrInitializeAVMWebClient();
      let listenerId: string;
      let timeoutId = window.setTimeout(() => {
        const error = new ARC0027MethodTimedOutError({
          method: ARC0027MethodEnum.SignTransactions,
          providerId: __PROVIDER_ID__,
        });

        toast({
          description: error.message,
          status: 'error',
          title: 'Sign Transactions Request Timeout',
        });

        // remove the listener, it is not needed
        if (listenerId) {
          _avmWebClient.removeListener(listenerId);
        }

        return reject(error);
      }, UPPER_REQUEST_TIMEOUT);

      listenerId = _avmWebClient.onSignTransactions(({ error, result }) => {
        // remove the listener, it is not needed
        _avmWebClient.removeListener(listenerId);

        if (error) {
          toast({
            description: error.message,
            status: 'error',
            title: 'Failed To Sign Transactions',
          });

          window.clearTimeout(timeoutId);

          return reject(error);
        }

        if (result) {
          window.clearTimeout(timeoutId);

          return resolve(result.stxns);
        }
      });

      _avmWebClient.signTransactions({
        providerId: __PROVIDER_ID__,
        txns: transactions,
      });
    });
  };
  // misc
  const getOrInitializeAVMWebClient = () => {
    let _avmWebClient: AVMWebClient;

    if (avmWebClient) {
      return avmWebClient;
    }

    _avmWebClient = AVMWebClient.init({
      debug: true,
    });

    setAVMWebClient(_avmWebClient);

    return _avmWebClient;
  };

  return {
    connectAction,
    disconnectAction,
    enabledAccounts,
    signMessageAction,
    signTransactionsAction,
  };
}
