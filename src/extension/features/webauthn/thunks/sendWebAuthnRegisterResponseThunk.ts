import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { decode as decodeBase64 } from '@stablelib/base64';
import { v4 as uuid } from 'uuid';
import browser from 'webextension-polyfill';

// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';
import { EncryptionMethodEnum } from '@extension/enums';
import { ThunkEnum } from '../enums';

// errors
import { AuthInvalidPublicKeyError } from '@common/errors';

// factories
import PublicKeyCredentialFactory from '@extension/models/PublicKeyCredentialFactory';

// messages
import WebAuthnRegisterResponseMessage from '@common/messages/WebAuthnRegisterResponseMessage';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// types
import type {
  IAccount,
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import type { TWebAuthnRegisterResponseThunkPayload } from '../types';

// utils
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';
import fetchDecryptedKeyPairFromStorageWithPasskey from '@extension/utils/fetchDecryptedKeyPairFromStorageWithPasskey';
import fetchDecryptedKeyPairFromStorageWithPassword from '@extension/utils/fetchDecryptedKeyPairFromStorageWithPassword';
import fetchDecryptedKeyPairFromStorageWithUnencrypted from '@extension/utils/fetchDecryptedKeyPairFromStorageWithUnencrypted';

const sendWebAuthnRegisterResponseThunk: AsyncThunk<
  void, // return
  TWebAuthnRegisterResponseThunkPayload, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  void,
  TWebAuthnRegisterResponseThunkPayload,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(
  ThunkEnum.SendWebAuthnRegisterResponse,
  async (
    { accountID, event, ...encryptionOptions },
    { dispatch, getState }
  ) => {
    const accounts = getState().accounts.items;
    const id = uuid();
    const logger = getState().system.logger;
    const message = event.payload.message;
    const reference = WebAuthnMessageReferenceEnum.RegisterResponse;
    const requestID = message.id;
    let account: IAccount | null;
    let address: string;
    let keyPair: Ed21559KeyPair | null = null;
    let publicKeyCredentialFactory: PublicKeyCredentialFactory;

    logger?.debug(
      `${ThunkEnum.SendWebAuthnRegisterResponse}: decrypting private key using "${encryptionOptions.type}" encryption method`
    );

    account = accounts.find(({ id }) => id === accountID) || null;

    if (!account) {
      logger.debug(
        `${ThunkEnum.SendWebAuthnRegisterResponse}: account "${accountID}" not found`
      );

      await browser.tabs.sendMessage(
        event.payload.originTabID,
        new WebAuthnRegisterResponseMessage({
          error: new AuthInvalidPublicKeyError('no account found'),
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
        `${
          ThunkEnum.SendWebAuthnRegisterResponse
        }: private key for "${convertPublicKeyToAVMAddress(
          account.publicKey
        )}" not found`
      );

      await browser.tabs.sendMessage(
        event.payload.originTabID,
        new WebAuthnRegisterResponseMessage({
          error: new AuthInvalidPublicKeyError('no private key found'),
          id,
          reference,
          requestID,
          result: null,
        })
      );

      return;
    }

    publicKeyCredentialFactory = PublicKeyCredentialFactory.generate({
      challenge: decodeBase64(message.payload.options.challenge),
      keyPair,
      origin: new URL(message.payload.clientInfo.host).origin,
      rp: message.payload.options.rp,
      user: {
        ...message.payload.options.user,
        id: decodeBase64(message.payload.options.user.id),
      },
    });

    // TODO: save passkey to account

    // return public credentials
    await browser.tabs.sendMessage(
      event.payload.originTabID,
      new WebAuthnRegisterResponseMessage({
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
          credential: publicKeyCredentialFactory.attestationCredential(),
        },
      })
    );

    logger.debug(
      `${ThunkEnum.SendWebAuthnRegisterResponse}: sent response "${reference}" message to the client via the middleware (content script)`
    );
  }
);

export default sendWebAuthnRegisterResponseThunk;
