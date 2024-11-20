import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// errors
import {
  BaseExtensionError,
  FailedToSendTransactionError,
  MalformedDataError,
  NetworkNotSelectedError,
  NotEnoughMinimumBalanceError,
  OfflineError,
} from '@extension/errors';

// models
import NetworkClient from '@extension/models/NetworkClient';

// types
import type {
  IAsyncThunkConfigWithRejectValue,
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';
import type { ISubmitTransactionsPayload } from '../types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import doesAccountFallBelowMinimumBalanceRequirementForTransactions from '@extension/utils/doesAccountFallBelowMinimumBalanceRequirementForTransactions';
import selectNodeIDByGenesisHashFromSettings from '@extension/utils/selectNodeIDByGenesisHashFromSettings/selectNodeIDByGenesisHashFromSettings';
import uniqueGenesisHashesFromTransactions from '@extension/utils/uniqueGenesisHashesFromTransactions';

const submitTransactionsThunk: AsyncThunk<
  string[], // return
  ISubmitTransactionsPayload, // args
  IAsyncThunkConfigWithRejectValue<IMainRootState>
> = createAsyncThunk<
  string[],
  ISubmitTransactionsPayload,
  IAsyncThunkConfigWithRejectValue<IMainRootState>
>(
  ThunkEnum.SubmitTransactions,
  async (
    { signedTransactions, transactions },
    { getState, rejectWithValue }
  ) => {
    const accounts = getState().accounts.items;
    const logger = getState().system.logger;
    const genesisHash =
      uniqueGenesisHashesFromTransactions(transactions).pop() || null;
    const networks = getState().networks.items;
    const online = getState().system.networkConnectivity.online;
    const sender = getState().sendAssets.sender;
    const settings = getState().settings;
    let _error: string;
    let network: INetworkWithTransactionParams | null;

    if (!sender) {
      _error = `sender not assigned`;

      logger.debug(`${ThunkEnum.SubmitTransactions}: ${_error}`);

      return rejectWithValue(new MalformedDataError(_error));
    }

    if (!online) {
      logger.debug(`${ThunkEnum.SubmitTransactions}: extension offline`);

      return rejectWithValue(
        new OfflineError('attempted to send transaction, but extension offline')
      );
    }

    if (!genesisHash) {
      logger.debug(
        `${ThunkEnum.SubmitTransactions}: failed to get the genesis hash from the transactions`
      );

      return rejectWithValue(
        new MalformedDataError(
          'unable to determine genesis hash from transactions'
        )
      );
    }

    network =
      networks.find((value) => value.genesisHash === genesisHash) || null;

    if (!network) {
      _error = `no network configuration found for "${genesisHash}"`;

      logger.debug(`${ThunkEnum.SubmitTransactions}: ${_error}`);

      return rejectWithValue(new NetworkNotSelectedError(_error));
    }

    // ensure the transactions do not cause the balance to fall below the minimum balance requirement
    if (
      doesAccountFallBelowMinimumBalanceRequirementForTransactions({
        account: sender,
        logger,
        network,
        transactions,
      })
    ) {
      _error = `total transaction cost will bring the account "${convertPublicKeyToAVMAddress(
        sender.publicKey
      )}" balance below the minimum balance requirement`;

      logger.debug(`${ThunkEnum.SubmitTransactions}: ${_error}`);

      return rejectWithValue(new NotEnoughMinimumBalanceError(_error));
    }

    try {
      await new NetworkClient({ logger, network }).sendTransactions({
        nodeID: selectNodeIDByGenesisHashFromSettings({
          genesisHash: network.genesisHash,
          settings,
        }),
        signedTransactions,
      });

      return transactions.map((value) => value.txID());
    } catch (error) {
      logger.error(`${ThunkEnum.SubmitTransactions}:`, error);

      if ((error as BaseExtensionError).code) {
        return rejectWithValue(error);
      }

      return rejectWithValue(new FailedToSendTransactionError(error.message));
    }
  }
);

export default submitTransactionsThunk;
