import { generate as generateUUID } from '@agoralabs-sh/uuid';
import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';
import { EncryptionMethodEnum } from '@provider/enums';
import { ThunkEnum } from '../enums';

// errors
import { WebAuthnInvalidPasskeyError, WebAuthnInvalidPublicKeyError } from '@common/errors';

// factories
import PublicKeyCredentialFactory from '@provider/models/PublicKeyCredentialFactory';

// features
import { saveAccountsThunk } from '@provider/features/accounts';

// messages
import WebAuthnAuthenticateResponseMessage from '@common/messages/WebAuthnAuthenticateResponseMessage';

// cryptography
import Ed21559KeyPair from '@provider/cryptography/Ed21559KeyPair';

// types
import type {
  IAccountPasskey,
  IAccountWithExtendedProps,
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@provider/types';
import type { TWebAuthnAuthenticateResponseThunkPayload } from '../types';

// utils
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';
import fetchDecryptedKeyPairFromStorageWithPasskey from '@provider/utils/fetchDecryptedKeyPairFromStorageWithPasskey';
import fetchDecryptedKeyPairFromStorageWithPassword from '@provider/utils/fetchDecryptedKeyPairFromStorageWithPassword';
import fetchDecryptedKeyPairFromStorageWithUnencrypted from '@provider/utils/fetchDecryptedKeyPairFromStorageWithUnencrypted';
import serialize from '@provider/utils/serialize';

const sendWebAuthnAuthenticateResponseThunk: AsyncThunk<
  void, // return
  TWebAuthnAuthenticateResponseThunkPayload, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  void,
  TWebAuthnAuthenticateResponseThunkPayload,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(
  ThunkEnum.SendWebAuthnAuthenticateResponse,
  async ({ accountID, event, passkeyID, ...encryptionOptions }, { dispatch, getState }) => {
    const accounts = getState().accounts.items;
    const id = generateUUID();
    const logger = getState().system.logger;
    const message = event.payload.message;
    const reference = WebAuthnMessageReferenceEnum.AuthenticateResponse;
    const requestID = message.id;
    let account: IAccountWithExtendedProps | null;
    let keyPair: Ed21559KeyPair | null = null;
    let passkey: IAccountPasskey | null;
    let publicKeyCredentialFactory: PublicKeyCredentialFactory;

    logger?.debug(
      `${ThunkEnum.SendWebAuthnAuthenticateResponse}: decrypting private key using "${encryptionOptions.type}" encryption method`
    );

    account = accounts.find(({ id }) => id === accountID) || null;

    if (!account) {
      logger.debug(`${ThunkEnum.SendWebAuthnAuthenticateResponse}: account "${accountID}" not found`);

      await browser.tabs.sendMessage(
        event.payload.originTabID,
        new WebAuthnAuthenticateResponseMessage({
          error: serialize(new WebAuthnInvalidPublicKeyError('no account found')),
          id,
          reference,
          requestID,
          result: null,
        })
      );

      return;
    }

    passkey = account.passkeys.find(({ id }) => id === passkeyID) || null;

    if (!passkey) {
      logger.debug(
        `${
          ThunkEnum.SendWebAuthnAuthenticateResponse
        }: passkey "${passkeyID}" for account "${convertPublicKeyToAVMAddress(account.publicKey)}" not found`
      );

      await browser.tabs.sendMessage(
        event.payload.originTabID,
        new WebAuthnAuthenticateResponseMessage({
          error: serialize(new WebAuthnInvalidPasskeyError('no passkey found')),
          id,
          reference,
          requestID,
          result: null,
        })
      );

      return;
    }

    switch (encryptionOptions.type) {
      case EncryptionMethodEnum.Passkey:
        keyPair = await fetchDecryptedKeyPairFromStorageWithPasskey({
          inputKeyMaterial: encryptionOptions.inputKeyMaterial,
          logger,
          publicKey: account.publicKey,
        });

        break;
      case EncryptionMethodEnum.Password:
        keyPair = await fetchDecryptedKeyPairFromStorageWithPassword({
          logger,
          password: encryptionOptions.password,
          publicKey: account.publicKey,
        });
        break;
      case EncryptionMethodEnum.Unencrypted:
        keyPair = await fetchDecryptedKeyPairFromStorageWithUnencrypted({
          logger,
          publicKey: account.publicKey,
        });
        break;
      default:
        break;
    }

    if (!keyPair) {
      logger.debug(
        `${ThunkEnum.SendWebAuthnAuthenticateResponse}: private key for "${convertPublicKeyToAVMAddress(
          account.publicKey
        )}" not found`
      );

      await browser.tabs.sendMessage(
        event.payload.originTabID,
        new WebAuthnAuthenticateResponseMessage({
          error: serialize(new WebAuthnInvalidPublicKeyError('no private key found')),
          id,
          reference,
          requestID,
          result: null,
        })
      );

      return;
    }

    publicKeyCredentialFactory = PublicKeyCredentialFactory.init({
      passkey,
      privateKey: keyPair.privateKey(),
      publicKeyCredentialRequestOptions: message.payload.options,
    });

    // update the passkey last used date
    dispatch(
      saveAccountsThunk([
        {
          ...account,
          passkeys: account.passkeys.map((value) =>
            value.id === passkeyID
              ? {
                  ...value,
                  lastUsedAt: new Date().getTime().toString(10),
                }
              : value
          ),
        },
      ])
    );

    // return public credentials
    await browser.tabs.sendMessage(
      event.payload.originTabID,
      new WebAuthnAuthenticateResponseMessage({
        error: null,
        id,
        reference,
        requestID,
        result: {
          account: {
            publicKey: account.publicKey,
            ...(account.color && {
              color: account.color,
            }),
            ...(account.icon && {
              icon: account.icon,
            }),
            ...(account.name && {
              name: account.name,
            }),
          },
          credential: publicKeyCredentialFactory.serializedAssertionCredential(),
        },
      })
    );

    logger.debug(
      `${ThunkEnum.SendWebAuthnAuthenticateResponse}: sent response "${reference}" message to the middleware (content script)`
    );
  }
);

export default sendWebAuthnAuthenticateResponseThunk;
