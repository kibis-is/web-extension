import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// types
import type {
  IAccountGroup,
  IAccountWithExtendedProps,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import type { IAddToGroupPayload } from '../types';

// utils
import isWatchAccount from '@extension/utils/isWatchAccount/isWatchAccount';
import serialize from '@extension/utils/serialize';
import { findAccountWithoutExtendedProps } from '../utils';

const addToGroupThunk: AsyncThunk<
  IAccountWithExtendedProps | null, // return
  IAddToGroupPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IAccountWithExtendedProps | null,
  IAddToGroupPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(ThunkEnum.AddToGroup, async ({ accountID, groupID }, { getState }) => {
  const logger = getState().system.logger;
  const accounts = getState().accounts.items;
  const groups = getState().accounts.groups;
  let account = serialize(findAccountWithoutExtendedProps(accountID, accounts));
  let group: IAccountGroup | null;
  let groupIndex: number;

  if (!account) {
    logger.debug(
      `${ThunkEnum.AddToGroup}: no account found for "${accountID}", ignoring`
    );

    return null;
  }

  group = groups.find(({ id }) => id === groupID) || null;

  if (!group) {
    logger.debug(
      `${ThunkEnum.AddToGroup}: no group found for "${groupID}", ignoring`
    );

    return null;
  }

  // get the group index based on the accounts already in the group
  groupIndex = accounts.filter(
    (value) =>
      !!value.groupID && value.groupID === group?.id && !!value.groupIndex
  ).length;

  account = {
    ...account,
    groupID,
    groupIndex,
  };

  await new AccountRepository().saveMany([account]);

  logger.debug(
    `${ThunkEnum.AddToGroup}: added account "${accountID}" to group "${groupID}"`
  );

  return {
    ...account,
    watchAccount: await isWatchAccount(account),
  };
});

export default addToGroupThunk;
