import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { EncryptionMethodEnum } from '@extension/enums';
import { ThunkEnum } from '../enums';

// errors
import { DecryptionError } from '@extension/errors';

// managers
import PasskeyManager from '@extension/managers/PasskeyManager';
import PasswordManager from '@extension/managers/PasswordManager';

// repositories
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

// types
import type {
  IAsyncThunkConfigWithRejectValue,
  IBackgroundRootState,
  IMainRootState,
  IPasskeyEncryptionCredentials,
  IPasswordEncryptionCredentials,
} from '@extension/types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

/**
 * Deactivates the credential lock by decrypting the private keys.
 */
const deactivateThunk: AsyncThunk<
  void, // return
  IPasskeyEncryptionCredentials | IPasswordEncryptionCredentials, // args
  IAsyncThunkConfigWithRejectValue<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  void,
  IPasskeyEncryptionCredentials | IPasswordEncryptionCredentials,
  IAsyncThunkConfigWithRejectValue<IBackgroundRootState | IMainRootState>
>(ThunkEnum.Deactivate, async (credentials, { getState, rejectWithValue }) => {
  const logger = getState().system.logger;
  const privateKeyRepository = new PrivateKeyRepository();
  let privateKeyItems = await privateKeyRepository.fetchAll();

  try {
    privateKeyItems = await Promise.all(
      privateKeyItems.map(async (value) => {
        const privateKeyItem = await PrivateKeyRepository.upgrade({
          encryptionCredentials: credentials,
          logger,
          privateKeyItem: value,
        });
        let decryptedPrivateKey: Uint8Array | null = null;

        if (credentials.type === EncryptionMethodEnum.Password) {
          decryptedPrivateKey = await PasswordManager.decryptBytes({
            bytes: PrivateKeyRepository.decode(
              privateKeyItem.encryptedPrivateKey
            ),
            logger,
            password: credentials.password,
          });
        }

        if (credentials.type === EncryptionMethodEnum.Passkey) {
          decryptedPrivateKey = await PasskeyManager.decryptBytes({
            encryptedBytes: PrivateKeyRepository.decode(
              privateKeyItem.encryptedPrivateKey
            ),
            inputKeyMaterial: credentials.inputKeyMaterial,
            logger,
            passkey: credentials.passkey,
          });
        }

        if (!decryptedPrivateKey) {
          throw new DecryptionError(
            `failed to decrypt private key for account "${convertPublicKeyToAVMAddress(
              value.publicKey
            )}"`
          );
        }

        return {
          ...privateKeyItem,
          privateKey: PrivateKeyRepository.encode(decryptedPrivateKey),
        };
      })
    );
  } catch (error) {
    logger.error(`${ThunkEnum.Deactivate}:`, error);

    return rejectWithValue(error);
  }

  logger.debug(
    `${ThunkEnum.Deactivate}: decrypted ${privateKeyItems.length} private keys`
  );

  await privateKeyRepository.saveMany(privateKeyItems);

  logger.debug(
    `${ThunkEnum.Deactivate}: saved decrypted private keys to storage`
  );

  return;
});

export default deactivateThunk;