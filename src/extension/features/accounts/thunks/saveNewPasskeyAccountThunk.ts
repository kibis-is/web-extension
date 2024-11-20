import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { isValidAddress } from 'algosdk';

// errors
import { MalformedDataError } from '@extension/errors';

// enums
import { ThunkEnum } from '../enums';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// types
import type {
  IAccount,
  IAccountWithExtendedProps,
  IAsyncThunkConfigWithRejectValue,
  IMainRootState,
  IRegistrationRootState,
} from '@extension/types';
import type { ISaveNewPasskeyAccountPayload } from '../types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import isWatchAccount from '@extension/utils/isWatchAccount';

const saveNewPasskeyAccountThunk: AsyncThunk<
  IAccountWithExtendedProps, // return
  ISaveNewPasskeyAccountPayload, // args
  IAsyncThunkConfigWithRejectValue<IMainRootState | IRegistrationRootState>
> = createAsyncThunk<
  IAccountWithExtendedProps,
  ISaveNewPasskeyAccountPayload,
  IAsyncThunkConfigWithRejectValue<IMainRootState | IRegistrationRootState>
>(
  ThunkEnum.SaveNewPasskeyAccount,
  async ({ passkey, publicKey, name }, { getState, rejectWithValue }) => {
    const logger = getState().system.logger;
    const accountRepository = new AccountRepository();
    const accounts = await accountRepository.fetchAll();
    const address: string = convertPublicKeyToAVMAddress(publicKey);
    let _error: string;
    let account: IAccount | null;

    logger.debug(
      `${ThunkEnum.SaveNewPasskeyAccount}: validating address "${address}"`
    );

    if (!isValidAddress(address)) {
      _error = `address "${address}" is not valid`;

      logger.debug(`${ThunkEnum.SaveNewPasskeyAccount}: ${_error}`);

      return rejectWithValue(new MalformedDataError(_error));
    }

    account =
      accounts.find(
        (value) => value.publicKey === AccountRepository.encode(publicKey)
      ) || null;

    logger.debug(
      `${ThunkEnum.SaveNewPasskeyAccount}: checking if "${address}" already exists`
    );

    // if the account exists, just return it
    if (account) {
      return {
        ...account,
        watchAccount: await isWatchAccount(account),
      };
    }

    account = AccountRepository.initializeDefaultAccount({
      passkey,
      publicKey: AccountRepository.encode(publicKey),
      ...(name && {
        name,
      }),
    });

    // save the account to storage
    await accountRepository.saveMany([account]);

    logger.debug(
      `${ThunkEnum.SaveNewPasskeyAccount}: saved passkey account "${address}" to storage`
    );

    return {
      ...account,
      watchAccount: await isWatchAccount(account),
    };
  }
);

export default saveNewPasskeyAccountThunk;
