import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import AccountRepository from '@provider/repositories/AccountRepository';

// types
import type { IAccountWithExtendedProps, IBaseAsyncThunkConfig, IMainRootState } from '@provider/types';

// utils
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';
import mapAccountWithExtendedPropsToAccount from '@provider/utils/mapAccountWithExtendedPropsToAccount';

const saveAccountsThunk: AsyncThunk<
  IAccountWithExtendedProps[], // return
  IAccountWithExtendedProps[], // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<IAccountWithExtendedProps[], IAccountWithExtendedProps[], IBaseAsyncThunkConfig<IMainRootState>>(
  ThunkEnum.SaveAccounts,
  async (accounts, { getState }) => {
    const logger = getState().system.logger;

    await new AccountRepository().saveMany(accounts.map(mapAccountWithExtendedPropsToAccount));

    logger.debug(
      `${ThunkEnum.SaveAccounts}: saved accounts [${accounts
        .map(({ publicKey }) => `"${convertPublicKeyToAVMAddress(publicKey)}"`)
        .join(',')}] to storage`
    );

    return accounts;
  }
);

export default saveAccountsThunk;
