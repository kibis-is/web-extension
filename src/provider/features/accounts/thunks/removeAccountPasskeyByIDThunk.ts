import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import AccountRepository from '@provider/repositories/AccountRepository';

// types
import type { IAccountWithExtendedProps, IBaseAsyncThunkConfig, IMainRootState } from '@provider/types';
import type { IRemovePasskeyByIDPayload } from '../types';

const removeAccountPasskeyByIDThunk: AsyncThunk<
  IAccountWithExtendedProps | null, // return
  IRemovePasskeyByIDPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IAccountWithExtendedProps | null,
  IRemovePasskeyByIDPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(ThunkEnum.RemovePasskeyByID, async ({ accountID, passkeyID }, { getState }) => {
  const accounts = getState().accounts.items;
  const logger = getState().system.logger;
  let account = accounts.find(({ id }) => id === accountID) || null;

  if (!account) {
    logger.debug(`${ThunkEnum.RemovePasskeyByID}: account "${accountID}" does not exist, ignoring`);

    return null;
  }

  account = {
    ...account,
    passkeys: account.passkeys.filter(({ id }) => id !== passkeyID),
  };

  await new AccountRepository().saveMany([account]);

  return account;
});

export default removeAccountPasskeyByIDThunk;
