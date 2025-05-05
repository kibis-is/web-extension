import { HStack, SkeletonText, Text, useDisclosure, VStack } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import AccountSelect from '@provider/components/accounts/AccountSelect';
import Button from '@common/components/Button';
import CopyButton from '@provider/components/CopyButton';
import PageHeader from '@provider/components/PageHeader';
import SeedPhraseDisplay, { SeedPhraseDisplaySkeleton } from '@provider/components/SeedPhraseDisplay';

// constants
import { DEFAULT_GAP } from '@common/constants';
import { ACCOUNT_SELECT_ITEM_MINIMUM_HEIGHT } from '@provider/constants';

// errors
import { BaseExtensionError } from '@common/errors';

// features
import { create as createNotification } from '@provider/features/notifications';

// hooks
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@provider/hooks/usePrimaryColorScheme';
import useViewSeedPhrase from './hooks/useViewSeedPhrase';

// modals
import AuthenticationModal from '@provider/modals/AuthenticationModal';

// selectors
import {
  useSelectActiveAccount,
  useSelectNonWatchAccounts,
  useSelectSettingsColorMode,
  useSelectSettingsSelectedNetwork,
  useSelectSystemInfo,
} from '@provider/selectors';

// types
import type {
  IAccountWithExtendedProps,
  IAppThunkDispatch,
  IMainRootState,
  TEncryptionCredentials,
} from '@provider/types';
import type { IAccountAndSeedPhraseValue } from './types';
import createMaskedSeedPhrase from '@provider/utils/createMaskedSeedPhrase';

const ViewSeedPhrasePage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const accounts = useSelectNonWatchAccounts();
  const activeAccount = useSelectActiveAccount();
  const colorMode = useSelectSettingsColorMode();
  const network = useSelectSettingsSelectedNetwork();
  const systemInfo = useSelectSystemInfo();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const { decrypting, decryptSeedPhraseAction } = useViewSeedPhrase();
  // state
  const [credentials, setCredentials] = useState<TEncryptionCredentials | null>(null);
  const [value, setValue] = useState<IAccountAndSeedPhraseValue | null>(null);
  // misc
  const _context = 'view-seed-phrase--page';
  // handlers
  const handleAccountSelect = async (account: IAccountWithExtendedProps) => {
    setValue(
      await decryptSeedPhraseAction({
        account,
        credentials,
        onError: handleOnError,
      })
    );
  };
  const handleOnAuthenticationModalConfirm = async (_credentials: TEncryptionCredentials) => {
    if (!value) {
      return;
    }

    setCredentials(_credentials);
    setValue(
      await decryptSeedPhraseAction({
        account: value.account,
        credentials: _credentials,
        onError: handleOnError,
      })
    );
  };
  const handleHideClick = () => {
    setCredentials(null);

    value &&
      setValue({
        ...value,
        masked: true,
        seedPhrase: createMaskedSeedPhrase(),
      });
  };
  const handleOnError = (error: BaseExtensionError) =>
    dispatch(
      createNotification({
        description: t<string>('errors.descriptions.code', {
          code: error.code,
          context: error.code,
        }),
        ephemeral: true,
        title: t<string>('errors.titles.code', { context: error.code }),
        type: 'error',
      })
    );
  const handleViewClick = async () => {
    // if we have the credentials, attempt to decrypt them
    if (value && credentials) {
      setValue(
        await decryptSeedPhraseAction({
          account: value.account,
          credentials,
          onError: handleOnError,
        })
      );

      return;
    }

    // otherwise go get them
    onAuthenticationModalOpen();
  };

  useEffect(() => {
    (async () => {
      let account: IAccountWithExtendedProps;

      if (activeAccount && !value) {
        account = activeAccount;

        // if the active account is a watch account, get the first non-watch account
        if (account.watchAccount) {
          account = accounts[0];
        }

        setValue(
          await decryptSeedPhraseAction({
            account,
            credentials,
            onError: handleOnError,
          })
        );
      }
    })();
  }, [activeAccount]);

  return (
    <>
      {/*authentication modal*/}
      <AuthenticationModal
        isOpen={isAuthenticationModalOpen}
        onClose={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleOnError}
      />

      {/*page title*/}
      <PageHeader colorMode={colorMode} title={t<string>('titles.page', { context: 'viewSeedPhrase' })} />

      <VStack flexGrow={1} pb={DEFAULT_GAP} px={DEFAULT_GAP} spacing={DEFAULT_GAP / 3} w="full">
        <VStack flexGrow={1} spacing={DEFAULT_GAP} w="full">
          {/*captions*/}
          <Text color={defaultTextColor} fontSize="sm" textAlign="left" w="full">
            {t<string>('captions.viewSeedPhrase1')}
          </Text>

          {/*account select*/}
          {!value || !network ? (
            <SkeletonText height={`${ACCOUNT_SELECT_ITEM_MINIMUM_HEIGHT}px`} noOfLines={1} w="full" />
          ) : (
            <AccountSelect
              accounts={accounts}
              allowWatchAccounts={false}
              colorMode={colorMode}
              network={network}
              onSelect={handleAccountSelect}
              required={true}
              systemInfo={systemInfo}
              value={value.account}
            />
          )}

          <Text color={defaultTextColor} fontSize="sm" textAlign="left" w="full">
            {t<string>('captions.viewSeedPhrase2')}
          </Text>

          {/*seed phrase*/}
          {!value ? (
            <SeedPhraseDisplaySkeleton />
          ) : (
            <SeedPhraseDisplay _context={_context} seedPhrase={value.seedPhrase} />
          )}
        </VStack>

        {!value || value.masked ? (
          // view button
          <Button
            colorMode={colorMode}
            isLoading={decrypting}
            onClick={handleViewClick}
            rightIcon={<IoEyeOutline />}
            size="lg"
            variant="solid"
            w="full"
          >
            {t<string>('buttons.view')}
          </Button>
        ) : (
          <HStack justifyContent="center" spacing={DEFAULT_GAP / 3} w="full">
            {/*hide button*/}
            <Button
              colorMode={colorMode}
              isLoading={decrypting}
              onClick={handleHideClick}
              rightIcon={<IoEyeOffOutline />}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.hide')}
            </Button>

            {/*copy button*/}
            <CopyButton
              colorMode={colorMode}
              colorScheme={primaryColorScheme}
              size="lg"
              value={value.seedPhrase}
              variant="solid"
              w="full"
            >
              {t<string>('buttons.copy')}
            </CopyButton>
          </HStack>
          // copy seed phrase button
        )}
      </VStack>
    </>
  );
};

export default ViewSeedPhrasePage;
