import { useState } from 'react';
import { useDispatch } from 'react-redux';
import browser from 'webextension-polyfill';

// errors
import { BaseExtensionError, InvalidPasswordError } from '@extension/errors';

// features
import { removeFromStorageThunk as removePasskeyToStorageThunk } from '@extension/features/passkeys';

// selectors
import { useSelectLogger } from '@extension/selectors';

// services
import PasskeyService from '@extension/services/PasskeyService';
import PasswordService from '@extension/services/PasswordService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IEncryptionState } from '@extension/components/ReEncryptKeysLoadingContent';
import type { IAppThunkDispatch, IPrivateKey } from '@extension/types';
import type { IRemovePasskeyActionOptions, IState } from './types';

// utils
import { encryptPrivateKeyItemAndDelay } from './utils';

export default function useRemovePasskey(): IState {
  const _hookName = 'useAddPasskey';
  const dispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const logger = useSelectLogger();
  // states
  const [encryptionProgressState, setEncryptionProgressState] = useState<
    IEncryptionState[]
  >([]);
  const [encrypting, setEncrypting] = useState<boolean>(false);
  const [error, setError] = useState<BaseExtensionError | null>(null);
  const [requesting, setRequesting] = useState<boolean>(false);
  // actions
  const removePasskeyAction = async ({
    passkey,
    password,
  }: IRemovePasskeyActionOptions): Promise<boolean> => {
    const _functionName = 'removePasskeyAction';
    const passwordService = new PasswordService({
      logger,
      passwordTag: browser.runtime.id,
    });
    let inputKeyMaterial: Uint8Array;
    let isPasswordValid: boolean;
    let privateKeyItems: IPrivateKey[];
    let privateKeyService: PrivateKeyService;

    // reset the previous values
    resetAction();

    isPasswordValid = await passwordService.verifyPassword(password);

    if (!isPasswordValid) {
      logger?.debug(`${_hookName}#${_functionName}: invalid password`);

      setError(new InvalidPasswordError());

      return false;
    }

    setRequesting(true);

    logger.debug(
      `${_hookName}#${_functionName}: requesting input key material from passkey "${passkey.id}"`
    );

    try {
      // fetch the encryption key material
      inputKeyMaterial = await PasskeyService.fetchInputKeyMaterialFromPasskey({
        credential: passkey,
        logger,
      });
    } catch (error) {
      logger?.debug(`${_hookName}#${_functionName}:`, error);

      setRequesting(false);
      setError(error);

      return false;
    }

    setRequesting(false);
    setEncrypting(true);

    privateKeyService = new PrivateKeyService({
      logger,
    });
    privateKeyItems = await privateKeyService.fetchAllFromStorage();

    // set the encryption state for each item to false
    setEncryptionProgressState(
      privateKeyItems.map(({ id }) => ({
        id,
        encrypted: false,
      }))
    );

    // re-encrypt each private key items with the password
    try {
      privateKeyItems = await Promise.all(
        privateKeyItems.map(async (privateKeyItem, index) => {
          const item = await encryptPrivateKeyItemAndDelay({
            delay: (index + 1) * 300, // add a staggered delay for the ui to catch up
            inputKeyMaterial,
            logger,
            passkey,
            password,
            privateKeyItem,
          });

          // update the encryption state
          setEncryptionProgressState((_encryptionProgressState) =>
            _encryptionProgressState.map((value) =>
              value.id === privateKeyItem.id
                ? {
                    ...value,
                    encrypted: true,
                  }
                : value
            )
          );

          return item;
        })
      );
    } catch (error) {
      logger?.debug(`${_hookName}#${_functionName}:`, error);

      setEncrypting(false);
      setError(error);

      return error;
    }

    // save the new encrypted items to storage
    await privateKeyService.saveManyToStorage(privateKeyItems);

    // remove the passkey to storage
    await dispatch(removePasskeyToStorageThunk()).unwrap();

    logger?.debug(
      `${_hookName}#${_functionName}: successfully removed passkey`
    );

    setEncrypting(false);

    return true;
  };
  const resetAction = () => {
    setEncryptionProgressState([]);
    setEncrypting(false);
    setError(null);
    setRequesting(false);
  };

  return {
    encryptionProgressState,
    encrypting,
    error,
    removePasskeyAction,
    requesting,
    resetAction,
  };
}
