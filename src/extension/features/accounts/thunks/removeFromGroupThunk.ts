import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// types
import type {
  IAccountWithExtendedProps,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';

// utils
import isWatchAccount from '@extension/utils/isWatchAccount/isWatchAccount';
import serialize from '@extension/utils/serialize';
import { findAccountWithoutExtendedProps } from '../utils';

const removeFromGroupThunk: AsyncThunk<
  IAccountWithExtendedProps | null, // return
  string, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IAccountWithExtendedProps | null,
  string,
  IBaseAsyncThunkConfig<IMainRootState>
>(ThunkEnum.RemoveFromGroup, async (accountID, { getState }) => {
  const logger = getState().system.logger;
  const accounts = getState().accounts.items;
  let account = serialize(findAccountWithoutExtendedProps(accountID, accounts));

  if (!account) {
    logger.debug(
      `${ThunkEnum.RemoveFromGroup}: no account found for "${accountID}", ignoring`
    );

    return null;
  }

  account = {
    ...account,
    groupID: null,
    groupIndex: null,
  };

  await new AccountRepository().saveMany([account]);

  logger.debug(
    `${ThunkEnum.RemoveFromGroup}: removed account "${accountID}" from group`
  );

  return {
    ...account,
    watchAccount: await isWatchAccount(account),
  };
});

export default removeFromGroupThunk;
