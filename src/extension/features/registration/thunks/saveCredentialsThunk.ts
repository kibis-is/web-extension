import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { encode as encodeUtf8 } from '@stablelib/utf8';
import browser from 'webextension-polyfill';

// enums
import { DelimiterEnum, EncryptionMethodEnum } from '@extension/enums';
import { ThunkEnum } from '../enums';

// errors
import { InvalidPasswordError } from '@extension/errors';

// managers
import PasswordManager from '@extension/managers/PasswordManager';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';
import PasswordTagRepository from '@extension/repositories/PasswordTagRepository';
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

// types
import type {
  IAccount,
  IAsyncThunkConfigWithRejectValue,
  INewAccountWithKeyPair,
  INewAccountWithPasskey,
  IPasswordTag,
  IPrivateKey,
  IRegistrationRootState,
} from '@extension/types';

const saveCredentialsThunk: AsyncThunk<
  IAccount[], // return
  (INewAccountWithKeyPair | INewAccountWithPasskey)[], // args
  IAsyncThunkConfigWithRejectValue<IRegistrationRootState>
> = createAsyncThunk<
  IAccount[],
  (INewAccountWithKeyPair | INewAccountWithPasskey)[],
  IAsyncThunkConfigWithRejectValue<IRegistrationRootState>
>(
  ThunkEnum.SaveCredentials,
  async (accounts, { getState, rejectWithValue }) => {
    const logger = getState().system.logger;
    const password = getState().registration.password;
    let _accounts: IAccount[] = [];
    let passwordTagRepository: PasswordTagRepository;
    let passwordTagItem: IPasswordTag;
    let privateKeyItem: IPrivateKey;
    let privateKeyItems: IPrivateKey[] = [];
    let privateKeyRepository: PrivateKeyRepository;

    if (!password) {
      logger.error(`${ThunkEnum.SaveCredentials}: no password found`);

      return rejectWithValue(new InvalidPasswordError());
    }

    passwordTagRepository = new PasswordTagRepository();
    privateKeyRepository = new PrivateKeyRepository();

    try {
      // reset any previous keys/credentials
      await passwordTagRepository.remove();
      await privateKeyRepository.removeAll();

      logger.debug(
        `${ThunkEnum.SaveCredentials}: removed previous credentials from storage`
      );

      // save the password and the keys
      passwordTagItem = await passwordTagRepository.save(
        PasswordTagRepository.create({
          encryptedTag: await PasswordManager.encryptBytes({
            bytes: encodeUtf8(browser.runtime.id),
            logger,
            password,
          }),
        })
      );
    } catch (error) {
      logger.error(`${ThunkEnum.SaveCredentials}:`, error);

      // clean up, we errored
      await passwordTagRepository.remove();
      await privateKeyRepository.removeAll();

      return rejectWithValue(error);
    }

    logger.debug(`${ThunkEnum.SaveCredentials}: saved password tag to storage`);

    for (const account of accounts) {
      if (account.__delimiter === DelimiterEnum.Passkey) {
        _accounts.push(
          AccountRepository.initializeDefaultAccount({
            passkey: account.passkey,
            publicKey: AccountRepository.encode(account.publicKey),
            ...(account.name && {
              name: account.name,
            }),
          })
        );
      }

      if (account.__delimiter === DelimiterEnum.KeyPair) {
        privateKeyItem = PrivateKeyRepository.create({
          encryptedPrivateKey: await PasswordManager.encryptBytes({
            bytes: account.keyPair.privateKey,
            logger,
            password,
          }),
          encryptionID: passwordTagItem.id,
          encryptionMethod: EncryptionMethodEnum.Password,
          publicKey: account.keyPair.publicKey,
        });

        privateKeyItems.push(privateKeyItem);
        _accounts.push(
          AccountRepository.initializeDefaultAccount({
            createdAt: privateKeyItem.createdAt,
            publicKey: privateKeyItem.publicKey,
            ...(account.name && {
              name: account.name,
            }),
          })
        );
      }
    }

    // save the private keys to storage
    await privateKeyRepository.saveMany(privateKeyItems);

    logger.debug(
      `${ThunkEnum.SaveCredentials}: successfully saved ${privateKeyItems.length} keys to storage`
    );

    // save the accounts to storage
    await new AccountRepository().saveMany(_accounts);

    logger.debug(
      `${ThunkEnum.SaveCredentials}: successfully saved ${_accounts.length} accounts to storage`
    );

    return _accounts;
  }
);

export default saveCredentialsThunk;
