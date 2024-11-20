import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// errors
import {
  BaseExtensionError,
  MalformedDataError,
  NetworkNotSelectedError,
  TransactionSigningError,
} from '@extension/errors';

// types
import type {
  IAsyncThunkConfigWithRejectValue,
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';
import type { TSignTransactionsThunkPayload } from '../types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import isAccountKnown from '@extension/utils/isAccountKnown';
import signTransaction from '@extension/utils/signTransaction';
import uniqueGenesisHashesFromTransactions from '@extension/utils/uniqueGenesisHashesFromTransactions';

const signTransactionsThunk: AsyncThunk<
  Uint8Array[], // return
  TSignTransactionsThunkPayload, // args
  IAsyncThunkConfigWithRejectValue<IMainRootState>
> = createAsyncThunk<
  Uint8Array[],
  TSignTransactionsThunkPayload,
  IAsyncThunkConfigWithRejectValue<IMainRootState>
>(
  ThunkEnum.SignTransactions,
  async (
    { transactions, ...encryptionOptions },
    { getState, rejectWithValue }
  ) => {
    const accounts = getState().accounts.items;
    const logger = getState().system.logger;
    const genesisHash =
      uniqueGenesisHashesFromTransactions(transactions).pop() || null;
    const networks = getState().networks.items;
    const sender = getState().sendAssets.sender;
    let _error: string;
    let network: INetworkWithTransactionParams | null;
    let senderAddress: string;

    if (!sender) {
      _error = `sender not assigned`;

      logger.debug(`${ThunkEnum.SignTransactions}: ${_error}`);

      return rejectWithValue(new MalformedDataError(_error));
    }

    if (!genesisHash) {
      logger.debug(
        `${ThunkEnum.SignTransactions}: failed to get the genesis hash from the transactions`
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

      logger.debug(`${ThunkEnum.SignTransactions}: ${_error}`);

      return rejectWithValue(new NetworkNotSelectedError(_error));
    }

    senderAddress = convertPublicKeyToAVMAddress(sender.publicKey);

    // check if we actually have the account
    if (!isAccountKnown(accounts, senderAddress)) {
      _error = `no account data found for "${senderAddress}" in wallet`;

      logger.debug(`${ThunkEnum.SignTransactions}: ${_error}`);

      return rejectWithValue(new MalformedDataError(_error));
    }

    try {
      return await Promise.all(
        transactions.map((value) =>
          signTransaction({
            accounts,
            authAccounts: accounts,
            logger,
            networks,
            unsignedTransaction: value,
            ...encryptionOptions,
          })
        )
      );
    } catch (error) {
      logger.error(`${ThunkEnum.SignTransactions}:`, error);

      if ((error as BaseExtensionError).code) {
        return rejectWithValue(error);
      }

      return rejectWithValue(
        new TransactionSigningError(
          transactions.map((value) => value.txID()),
          error.message
        )
      );
    }
  }
);

export default signTransactionsThunk;
