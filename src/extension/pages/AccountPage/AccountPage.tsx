import {
  ColorMode,
  Heading,
  HStack,
  Icon,
  Spacer,
  type StackProps,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { type FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsFolderMinus, BsFolderPlus } from 'react-icons/bs';
import {
  IoAdd,
  IoCloudOfflineOutline,
  IoGiftOutline,
  IoLockClosedOutline,
  IoLockOpenOutline,
  IoPencil,
  IoQrCodeOutline,
  IoStarOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// components
import AccountPageAddressDisplay from '@extension/components/accounts/AccountPageAddressDisplay';
import ActivityTab from '@extension/components/ActivityTab';
import AssetsTab from '@extension/components/AssetsTab';
import AVMNamesTab from '@extension/components/avm-names/AVMNamesTab';
import CopyIconButton from '@extension/components/CopyIconButton';
import EmptyState from '@common/components/EmptyState';
import IconButton from '@common/components/IconButton';
import GroupBadge from '@extension/components/GroupBadge';
import NativeBalance from '@extension/components/NativeBalance';
import NetworkSelect from '@extension/components/NetworkSelect';
import NFTsTab from '@extension/components/nfts/NFTsTab';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import OverflowMenu from '@extension/components/OverflowMenu';
import PasskeysTab from '@extension/components/PasskeysTab';
import PolisAccountBadge from '@extension/components/PolisAccountBadge';
import ReKeyedAccountBadge from '@extension/components/RekeyedAccountBadge';
import StakingTab from '@extension/components/StakingTab';
import WatchAccountBadge from '@extension/components/WatchAccountBadge';
import AccountPageSkeletonContent from './AccountPageSkeletonContent';

// constants
import { DEFAULT_GAP } from '@common/constants';
import {
  ACCOUNT_PAGE_HEADER_ITEM_HEIGHT,
  ACCOUNTS_ROUTE,
  ADD_ACCOUNT_ROUTE,
  PASSKEY_ROUTE,
} from '@extension/constants';

// enums
import { AccountTabEnum } from '@extension/enums';

// features
import {
  removeFromGroupThunk,
  removeAccountByIdThunk,
  removeAccountPasskeyByIDThunk,
  saveAccountsThunk,
  saveActiveAccountDetails,
  updateAccountsThunk,
} from '@extension/features/accounts';
import { openConfirmModal, setWhatsNewModal } from '@extension/features/layout';
import { openModal as openMoveGroupModal } from '@extension/features/move-group-modal';
import { create as createNotification } from '@extension/features/notifications';
import { updateTransactionParamsForSelectedNetworkThunk } from '@extension/features/networks';
import { setAccountAndType as setReKeyAccount } from '@extension/features/re-key-account';
import { saveToStorageThunk as saveSettingsToStorageThunk } from '@extension/features/settings';
import { savePolisAccountIDThunk } from '@extension/features/system';

// hooks
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';

// icons
import BsFolderMove from '@extension/icons/BsFolderMove';

// modals
import AVMNameModal from '@extension/modals/avm-names/AVMNameModal';
import EditAccountModal from '@extension/modals/EditAccountModal';
import ShareAddressModal from '@extension/modals/ShareAddressModal';

// repositories
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

// selectors
import {
  useSelectAccounts,
  useSelectActiveAccount,
  useSelectActiveAccountDetails,
  useSelectActiveAccountGroup,
  useSelectActiveAccountInformation,
  useSelectActiveAccountStakingApps,
  useSelectActiveAccountTransactions,
  useSelectActiveAccountTransactionsUpdating,
  useSelectAccountsFetching,
  useSelectARC0072AssetsFetching,
  useSelectIsOnline,
  useSelectNetworks,
  useSelectSettingsColorMode,
  useSelectSettingsPreferredBlockExplorer,
  useSelectSettingsSelectedNetwork,
  useSelectSettings,
  useSelectSettingsFetching,
  useSelectSystemInfo,
} from '@extension/selectors';

// types
import type { TReKeyType } from '@extension/features/re-key-account';
import type {
  IAccountStakingApp,
  IAccountWithExtendedProps,
  IAppThunkDispatch,
  IARC0072AssetHolding,
  IMainRootState,
  INetwork,
} from '@extension/types';

// utils
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@common/utils/ellipseAddress';
import isReKeyedAuthAccountAvailable from '@extension/utils/isReKeyedAuthAccountAvailable';
import StakingAppModal from '@extension/modals/StakingAppModal';

const AccountPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const {
    isOpen: isEditAccountModalOpen,
    onClose: onEditAccountModalClose,
    onOpen: onEditAccountModalOpen,
  } = useDisclosure();
  const {
    isOpen: isShareAddressModalOpen,
    onClose: onShareAddressModalClose,
    onOpen: onShareAddressModalOpen,
  } = useDisclosure();
  const navigate = useNavigate();
  // selectors
  const account = useSelectActiveAccount();
  const accountInformation = useSelectActiveAccountInformation();
  const accounts = useSelectAccounts();
  const accountTransactions = useSelectActiveAccountTransactions();
  const activeAccountDetails = useSelectActiveAccountDetails();
  const colorMode = useSelectSettingsColorMode();
  const fetchingAccounts = useSelectAccountsFetching();
  const fetchingSettings = useSelectSettingsFetching();
  const fetchingARC0072AssetHoldings = useSelectARC0072AssetsFetching();
  const group = useSelectActiveAccountGroup();
  const online = useSelectIsOnline();
  const network = useSelectSettingsSelectedNetwork();
  const networks = useSelectNetworks();
  const explorer = useSelectSettingsPreferredBlockExplorer();
  const settings = useSelectSettings();
  const stakingApps = useSelectActiveAccountStakingApps();
  const systemInfo = useSelectSystemInfo();
  const updatingActiveAccountTransactions =
    useSelectActiveAccountTransactionsUpdating();
  // hooks
  const primaryColorScheme = usePrimaryColorScheme();
  // states
  const [selectedName, setSelectedName] = useState<IARC0072AssetHolding | null>(
    null
  );
  const [selectedStakingApp, setSelectedStakingApp] =
    useState<IAccountStakingApp | null>(null);
  // misc
  const canReKeyAccount = () => {
    if (!account || !accountInformation) {
      return false;
    }

    // if it is a watch account, but it has been re-keyed and the re-key is available, we can re-key
    if (account.watchAccount) {
      return !!(
        accountInformation.authAddress &&
        isReKeyedAuthAccountAvailable({
          accounts,
          authAddress: accountInformation.authAddress,
        })
      );
    }

    return true;
  };
  // handlers
  const handleActivityScrollEnd = () => {
    if (account && accountTransactions && accountTransactions.next) {
      dispatch(
        updateAccountsThunk({
          accountIDs: [account.id],
        })
      );
    }
  };
  const handleAddAccountClick = () => navigate(ADD_ACCOUNT_ROUTE);
  const handleOnAVMNameModalClose = useCallback(
    () => setSelectedName(null),
    [setSelectedName]
  );
  const handleOnEditAccountClick = () => onEditAccountModalOpen();
  const handleOnMakePrimaryClick = () =>
    account && dispatch(savePolisAccountIDThunk(account.id));
  const handleOnMoveGroupClick = () =>
    account && dispatch(openMoveGroupModal(account.id));
  const handleOnRefreshActivityClick = () => {
    dispatch(
      updateAccountsThunk({
        accountIDs: accounts.map(({ id }) => id),
        information: false, // get account information
        notifyOnNewTransactions: true,
        refreshTransactions: true, // get latest transactions
      })
    );
  };
  const handleOnRemoveGroupClick = async () => {
    let _account: IAccountWithExtendedProps | null;

    if (!account || !group) {
      return;
    }

    _account = await dispatch(removeFromGroupThunk(account.id)).unwrap();

    if (!_account) {
      return;
    }

    dispatch(
      createNotification({
        ephemeral: true,
        title: t<string>('headings.removedGroup'),
        type: 'info',
      })
    );
  };
  const handleOnRemovePasskeyClick = useCallback(
    (id: string) => {
      const passkey =
        account?.passkeys.find((value) => value.id === id) || null;

      if (!account || !passkey) {
        return;
      }

      dispatch(
        openConfirmModal({
          description: t<string>('captions.removeAccountPasskeyConfirm', {
            name: passkey.rp.name,
          }),
          onConfirm: async () => {
            const _account = await dispatch(
              removeAccountPasskeyByIDThunk({
                accountID: account.id,
                passkeyID: passkey.id,
              })
            ).unwrap();

            if (!_account) {
              return;
            }

            dispatch(
              createNotification({
                ephemeral: true,
                title: t<string>('headings.removedPasskey'),
                type: 'info',
              })
            );
          },
          title: t<string>('headings.removePasskey'),
        })
      );
    },
    [account]
  );
  const handleOnStakingAppModalClose = useCallback(
    () => setSelectedStakingApp(null),
    [setSelectedStakingApp]
  );
  const handleOnViewAVMNameClick = useCallback(
    (id: string) =>
      setSelectedName(
        accountInformation?.enVoi.items.find(({ tokenId }) => id === tokenId) ||
          null
      ),
    [accountInformation, setSelectedName]
  );
  const handleOnViewPasskeyClick = useCallback(
    (id: string) => navigate(`${ACCOUNTS_ROUTE}${PASSKEY_ROUTE}/${id}`),
    []
  );
  const handleOnViewStakingApp = useCallback(
    (id: string) =>
      setSelectedStakingApp(
        stakingApps.find(({ appID }) => appID === id) || null
      ),
    [stakingApps, setSelectedStakingApp]
  );
  const handleOnWhatsNewClick = () => dispatch(setWhatsNewModal(true));
  const handleNetworkSelect = async (value: INetwork) => {
    await dispatch(
      saveSettingsToStorageThunk({
        ...settings,
        general: {
          ...settings.general,
          selectedNetworkGenesisHash: value.genesisHash,
        },
      })
    ).unwrap();

    // when the settings have been updated, fetch update the account and transaction params
    dispatch(
      updateAccountsThunk({
        accountIDs: accounts.map(({ id }) => id),
      })
    );
    dispatch(updateTransactionParamsForSelectedNetworkThunk());
  };
  const handleReKeyAccountClick = (type: TReKeyType) => () =>
    account &&
    dispatch(
      setReKeyAccount({
        account,
        type,
      })
    );
  const handleRemoveAccountClick = () => {
    if (account) {
      dispatch(
        openConfirmModal({
          description: t<string>('captions.removeAccount', {
            address: ellipseAddress(
              convertPublicKeyToAVMAddress(
                PrivateKeyRepository.decode(account.publicKey)
              ),
              {
                end: 10,
                start: 10,
              }
            ),
          }),
          onConfirm: () => dispatch(removeAccountByIdThunk(account.id)),
          title: t<string>('headings.removeAccount'),
          ...(!account.watchAccount && {
            warningText: t<string>('captions.removeAccountWarning'),
          }),
        })
      );
    }
  };
  const handleTabChange = (tabIndex: AccountTabEnum) => {
    if (account) {
      dispatch(
        saveActiveAccountDetails({
          accountId: account.id,
          tabIndex,
        })
      );
    }
  };
  // renders
  const renderContent = () => {
    const headerContainerProps: StackProps = {
      alignItems: 'flex-start',
      px: DEFAULT_GAP - 2,
      spacing: DEFAULT_GAP / 3,
      w: 'full',
    };
    let address: string;

    if (fetchingAccounts || fetchingSettings) {
      return (
        <AccountPageSkeletonContent
          {...headerContainerProps}
          pt={DEFAULT_GAP - 2}
        />
      );
    }

    if (account && accountInformation && network) {
      address = convertPublicKeyToAVMAddress(
        PrivateKeyRepository.decode(account.publicKey)
      );

      return (
        <>
          {/*header*/}
          <VStack {...headerContainerProps}>
            {/*top elements*/}
            <HStack
              minH={ACCOUNT_PAGE_HEADER_ITEM_HEIGHT}
              pt={DEFAULT_GAP - 2}
              w="full"
            >
              {/*network connectivity*/}
              {!online && (
                <Tooltip
                  aria-label="Offline icon"
                  label={t<string>('captions.offline')}
                >
                  <span
                    style={{
                      height: '1em',
                      lineHeight: '1em',
                    }}
                  >
                    <Icon as={IoCloudOfflineOutline} color="red.500" />
                  </span>
                </Tooltip>
              )}

              <Spacer />

              {/*what's new*/}
              <Tooltip label={t<string>('labels.whatsNew')}>
                <IconButton
                  aria-label={t<string>('ariaLabels.plusIcon')}
                  colorMode={colorMode}
                  icon={IoGiftOutline}
                  onClick={handleOnWhatsNewClick}
                  size="sm"
                  variant="ghost"
                />
              </Tooltip>

              {/*network selection*/}
              <NetworkSelect
                networks={networks}
                onSelect={handleNetworkSelect}
                size="xs"
                value={network}
              />
            </HStack>

            {/*name/envoi/address*/}
            <AccountPageAddressDisplay account={account} network={network} />

            {/*balance*/}
            <HStack
              alignItems="center"
              justifyContent="flex-end"
              spacing={1}
              w="full"
            >
              <NativeBalance
                atomicBalance={new BigNumber(accountInformation.atomicBalance)}
                minAtomicBalance={
                  new BigNumber(accountInformation.minAtomicBalance)
                }
                nativeCurrency={network.nativeCurrency}
              />
            </HStack>

            {/*controls*/}
            <HStack
              alignItems="center"
              h={ACCOUNT_PAGE_HEADER_ITEM_HEIGHT}
              justifyContent="flex-end"
              spacing={1}
              w="full"
            >
              {/*edit account*/}
              <Tooltip label={t<string>('labels.editAccount')}>
                <IconButton
                  aria-label={t<string>('labels.editAccount')}
                  colorMode={colorMode}
                  icon={IoPencil}
                  onClick={handleOnEditAccountClick}
                  size="sm"
                  variant="ghost"
                />
              </Tooltip>

              {/*copy address*/}
              <CopyIconButton
                ariaLabel={t<string>('labels.copyAddress')}
                tooltipLabel={t<string>('labels.copyAddress')}
                value={address}
              />

              {/*open address on explorer*/}
              {explorer && (
                <OpenTabIconButton
                  tooltipLabel={t<string>('captions.openOn', {
                    name: explorer.canonicalName,
                  })}
                  url={explorer.accountURL(address)}
                />
              )}

              {/*share address*/}
              <Tooltip label={t<string>('labels.shareAddress')}>
                <IconButton
                  aria-label="Show QR code"
                  colorMode={colorMode}
                  icon={IoQrCodeOutline}
                  onClick={onShareAddressModalOpen}
                  size="sm"
                  variant="ghost"
                />
              </Tooltip>

              {/*overflow menu*/}
              <OverflowMenu
                items={[
                  // make primary
                  ...(!account ||
                  !systemInfo ||
                  systemInfo.polisAccountID !== account.id
                    ? [
                        {
                          icon: IoStarOutline,
                          label: t<string>('labels.makePrimary'),
                          onSelect: handleOnMakePrimaryClick,
                        },
                      ]
                    : []),
                  // add/remove to group
                  ...(group
                    ? [
                        {
                          icon: BsFolderMove,
                          label: t<string>('labels.moveGroup'),
                          onSelect: handleOnMoveGroupClick,
                        },
                        {
                          icon: BsFolderMinus,
                          label: t<string>('labels.removeFromGroup', {
                            name: group.name,
                          }),
                          onSelect: handleOnRemoveGroupClick,
                        },
                      ]
                    : [
                        {
                          icon: BsFolderPlus,
                          label: t<string>('labels.addToGroup'),
                          onSelect: handleOnMoveGroupClick,
                        },
                      ]),
                  // re-key
                  ...(canReKeyAccount()
                    ? [
                        {
                          icon: IoLockClosedOutline,
                          label: t<string>('labels.reKey'),
                          onSelect: handleReKeyAccountClick('rekey'),
                        },
                      ]
                    : []),
                  // undo re-key
                  ...(accountInformation.authAddress &&
                  isReKeyedAuthAccountAvailable({
                    accounts,
                    authAddress: accountInformation.authAddress,
                  })
                    ? [
                        {
                          icon: IoLockOpenOutline,
                          label: t<string>('labels.undoReKey'),
                          onSelect: handleReKeyAccountClick('undo'),
                        },
                      ]
                    : []),
                  // remove account
                  {
                    icon: IoTrashOutline,
                    label: t<string>('labels.removeAccount'),
                    onSelect: handleRemoveAccountClick,
                  },
                ]}
              />
            </HStack>

            {/*badges*/}
            <VStack alignItems="flex-end" spacing={DEFAULT_GAP / 3} w="full">
              <HStack
                alignItems="center"
                spacing={DEFAULT_GAP / 3}
                justifyContent="flex-end"
                w="full"
              >
                {/*polis account badge*/}
                {account &&
                  systemInfo &&
                  systemInfo.polisAccountID === account.id && (
                    <PolisAccountBadge />
                  )}

                {/*group badge*/}
                {group && <GroupBadge group={group} />}
              </HStack>

              <HStack
                alignItems="center"
                spacing={DEFAULT_GAP / 3}
                justifyContent="flex-end"
                w="full"
              >
                {/*watch account badge*/}
                {renderWatchAccountBadge()}

                {/*re-keyed badge*/}
                {renderReKeyedAccountBadge()}
              </HStack>
            </VStack>
          </VStack>

          <Spacer />

          {/*tabs*/}
          <Tabs
            colorScheme={primaryColorScheme}
            defaultIndex={
              activeAccountDetails?.tabIndex || AccountTabEnum.Assets
            }
            isLazy={true}
            m={0}
            onChange={handleTabChange}
            sx={{ display: 'flex', flexDirection: 'column' }}
            w="full"
          >
            <TabList sx={{ overflowX: 'scroll' }}>
              <Tab>{t<string>('labels.assets')}</Tab>
              <Tab>{t<string>('labels.nfts')}</Tab>
              <Tab>{t<string>('labels.names')}</Tab>
              <Tab>{t<string>('labels.activity')}</Tab>
              {settings.advanced.allowAccountPasskeys && (
                <Tab isDisabled={account.watchAccount}>
                  {t<string>('labels.passkeys')}
                </Tab>
              )}
              <Tab>{t<string>('labels.staking')}</Tab>
            </TabList>

            <TabPanels sx={{ display: 'flex', flexDirection: 'column' }}>
              <AssetsTab account={account} colorMode={colorMode} />

              <NFTsTab
                account={account}
                colorMode={colorMode}
                fetching={fetchingARC0072AssetHoldings}
                network={network}
              />

              {accountInformation && (
                <AVMNamesTab
                  accountInformation={accountInformation}
                  colorMode={colorMode}
                  fetching={fetchingARC0072AssetHoldings}
                  network={network}
                  onViewClick={handleOnViewAVMNameClick}
                />
              )}

              <ActivityTab
                account={account}
                accounts={accounts}
                colorMode={colorMode}
                fetching={fetchingAccounts}
                network={network}
                onRefreshClick={handleOnRefreshActivityClick}
                onScrollEnd={handleActivityScrollEnd}
                updating={updatingActiveAccountTransactions}
              />

              {settings.advanced.allowAccountPasskeys && (
                <PasskeysTab
                  account={account}
                  colorMode={colorMode}
                  fetching={fetchingAccounts}
                  onRemoveClick={handleOnRemovePasskeyClick}
                  onViewClick={handleOnViewPasskeyClick}
                />
              )}

              <StakingTab
                colorMode={colorMode}
                fetching={fetchingAccounts}
                network={network}
                stakingApps={stakingApps}
                onViewClick={handleOnViewStakingApp}
              />
            </TabPanels>
          </Tabs>
        </>
      );
    }

    return (
      <>
        {/*empty state*/}
        <Spacer />

        <EmptyState
          button={{
            icon: IoAdd,
            label: t<string>('buttons.addAccount'),
            onClick: handleAddAccountClick,
          }}
          colorMode={colorMode}
          description={t<string>('captions.noAccountsFound')}
          text={t<string>('headings.noAccountsFound')}
        />

        <Spacer />
      </>
    );
  };
  const renderReKeyedAccountBadge = () => {
    let isAuthAccountAvailable = false;

    if (accountInformation && accountInformation.authAddress) {
      isAuthAccountAvailable = isReKeyedAuthAccountAvailable({
        accounts,
        authAddress: accountInformation.authAddress,
      });

      return (
        <ReKeyedAccountBadge
          authAddress={accountInformation.authAddress}
          isAuthAccountAvailable={isAuthAccountAvailable}
          tooltipLabel={
            isAuthAccountAvailable
              ? t<string>('labels.reKeyedToAccount', {
                  address: accountInformation.authAddress,
                })
              : undefined
          }
        />
      );
    }

    return null;
  };
  const renderWatchAccountBadge = () => {
    const watchAccountBadge = <WatchAccountBadge />;

    // if this is a re-keyed account
    if (accountInformation && accountInformation.authAddress) {
      // if no auth account is present, or the auth account is a watch account, show a watch badge
      if (
        !isReKeyedAuthAccountAvailable({
          accounts,
          authAddress: accountInformation.authAddress,
        })
      ) {
        return watchAccountBadge;
      }

      return null;
    }

    if (account && account.watchAccount) {
      return watchAccountBadge;
    }

    return null;
  };

  return (
    <>
      {account && (
        <>
          <EditAccountModal
            isOpen={isEditAccountModalOpen}
            onClose={onEditAccountModalClose}
          />
          <AVMNameModal
            item={selectedName}
            network={network}
            onClose={handleOnAVMNameModalClose}
          />
          <StakingAppModal
            app={selectedStakingApp}
            network={network}
            onClose={handleOnStakingAppModalClose}
          />
          <ShareAddressModal
            address={convertPublicKeyToAVMAddress(
              PrivateKeyRepository.decode(account.publicKey)
            )}
            isOpen={isShareAddressModalOpen}
            onClose={onShareAddressModalClose}
          />
        </>
      )}

      <VStack
        alignItems="center"
        justifyContent="flex-start"
        flexGrow={1}
        w="full"
      >
        {renderContent()}
      </VStack>
    </>
  );
};

export default AccountPage;
