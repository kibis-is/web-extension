import { HStack, Text, VStack } from '@chakra-ui/react';
import React, {
  type FC,
  type TransitionEvent,
  useEffect,
  useState,
} from 'react';
import {
  IoAddCircleOutline,
  IoChevronBack,
  IoChevronForward,
  IoFolderOutline,
  IoScanOutline,
  IoSendOutline,
  IoSettingsOutline,
} from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// components
import Divider from '@extension/components/Divider';
import IconButton from '@common/components/IconButton';
import KibisisIcon from '@extension/components/KibisisIcon';
import ScrollableContainer from '@extension/components/ScrollableContainer';
import SideBarAccountList from '@extension/components/sidebar/SideBarAccountList';
import SideBarActionItem from '@extension/components/sidebar/SideBarActionItem';
import SideBarGroupList from '@extension/components/sidebar/SideBarGroupList';
import SideBarSkeletonItem from '@extension/components/sidebar/SideBarSkeletonItem';

// constants
import { BODY_BACKGROUND_COLOR } from '@common/constants';
import {
  ACCOUNTS_ROUTE,
  ADD_ACCOUNT_ROUTE,
  SETTINGS_ROUTE,
  SIDEBAR_BORDER_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
} from '@extension/constants';

// enums
import { AccountTabEnum } from '@extension/enums';

// features
import {
  removeFromGroupThunk,
  saveAccountGroupsThunk,
  saveAccountsThunk,
  saveActiveAccountDetails,
  updateAccountsThunk,
} from '@extension/features/accounts';
import {
  openConfirmModal,
  setScanQRCodeModal,
} from '@extension/features/layout';
import { openModal as openManageGroupsModal } from '@extension/features/manage-groups-modal';
import { openModal as openMoveGroupModal } from '@extension/features/move-group-modal';
import { initialize as initializeSendAssets } from '@extension/features/send-assets';

// hooks
import useBorderColor from '@extension/hooks/useBorderColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// selectors
import {
  useSelectAccountGroups,
  useSelectAccounts,
  useSelectAccountsFetching,
  useSelectActiveAccount,
  useSelectActiveAccountDetails,
  useSelectAvailableAccountsForSelectedNetwork,
  useSelectSettingsColorMode,
  useSelectSettingsSelectedNetwork,
  useSelectSystemInfo,
} from '@extension/selectors';

// types
import type {
  IAccountGroup,
  IAccountWithExtendedProps,
  IAppThunkDispatch,
  IMainRootState,
} from '@extension/types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';
import ellipseAddress from '@common/utils/ellipseAddress';
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';

const SideBar: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const navigate = useNavigate();
  // selectors
  const accounts = useSelectAccounts();
  const activeAccount = useSelectActiveAccount();
  const activeAccountDetails = useSelectActiveAccountDetails();
  const availableAccounts = useSelectAvailableAccountsForSelectedNetwork();
  const colorMode = useSelectSettingsColorMode();
  const fetchingAccounts = useSelectAccountsFetching();
  const groups = useSelectAccountGroups();
  const network = useSelectSettingsSelectedNetwork();
  const systemInfo = useSelectSystemInfo();
  // hooks
  const borderColor = useBorderColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  // state
  const [width, setWidth] = useState<number>(SIDEBAR_MIN_WIDTH);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHeaderShowing, setIsHeaderShowing] = useState<boolean>(false);
  // handlers
  const onCloseSideBar = () => {
    setIsHeaderShowing(false);
    setIsOpen(false);
  };
  const handleOpenToggleClick = () => {
    setIsHeaderShowing(false);
    setIsOpen(!isOpen);
  };
  const handleAddAccountClick = () => {
    onCloseSideBar();
    navigate(ADD_ACCOUNT_ROUTE);
  };
  const handleOnAccountClick = async (id: string) => {
    await dispatch(
      saveActiveAccountDetails({
        accountId: id,
        tabIndex: activeAccountDetails?.tabIndex || AccountTabEnum.Assets,
      })
    );
    dispatch(
      updateAccountsThunk({
        accountIDs: [id],
        notifyOnNewTransactions: true,
        refreshTransactions: true,
      })
    );
    navigate(`${ACCOUNTS_ROUTE}`, {
      replace: true,
    });

    onCloseSideBar();
  };
  const handleOnAccountSort = (items: IAccountWithExtendedProps[]) =>
    dispatch(saveAccountsThunk(items));
  const handleOnAddToGroupClick = (accountID: string) =>
    dispatch(openMoveGroupModal(accountID));
  const handleOnGroupSort = (items: IAccountGroup[]) =>
    dispatch(saveAccountGroupsThunk(items));
  const handleOnManageGroupsClick = () => dispatch(openManageGroupsModal());
  const handleOnRemoveFromGroupClick = (accountID: string) => {
    const account = accounts.find((value) => value.id === accountID) || null;
    let group: IAccountGroup | null;
    if (!account) {
      return;
    }

    group = groups.find((value) => value.id === account?.groupID) || null;

    if (!group) {
      return;
    }

    dispatch(
      openConfirmModal({
        description: t<string>('captions.removedFromGroupConfirm', {
          account:
            account.name ||
            ellipseAddress(convertPublicKeyToAVMAddress(account.publicKey)),
          group: group.name,
        }),
        onConfirm: () => dispatch(removeFromGroupThunk(account.id)),
        title: t<string>('headings.removedFromGroupConfirm'),
      })
    );
  };
  const handleScanQRCodeClick = () =>
    dispatch(
      setScanQRCodeModal({
        allowedAuthorities: [], // allow all
        allowedParams: [], // allow all
      })
    );
  const handleSendAssetClick = () => {
    let fromAccount: IAccountWithExtendedProps | null;

    if (!activeAccount || !network) {
      return;
    }

    // for the active account is eligible, use it as the from account, otherwise get the first account in the list
    fromAccount =
      availableAccounts.find((value) => value.id === activeAccount.id) ||
      availableAccounts[0] ||
      null;

    if (!fromAccount) {
      return;
    }

    dispatch(
      initializeSendAssets({
        sender: fromAccount,
        asset: network.nativeCurrency, // use native currency
      })
    );
  };
  const handleSettingsClick = () => {
    onCloseSideBar();
    navigate(SETTINGS_ROUTE);
  };
  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName === 'width' && width >= SIDEBAR_MAX_WIDTH) {
      setIsHeaderShowing(true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setWidth(SIDEBAR_MAX_WIDTH);

      return;
    }

    setWidth(SIDEBAR_MIN_WIDTH);
  }, [isOpen]);

  return (
    <VStack
      backgroundColor={BODY_BACKGROUND_COLOR}
      borderRightColor={borderColor}
      borderRightStyle="solid"
      borderRightWidth={SIDEBAR_BORDER_WIDTH}
      h="100vh"
      left={0}
      onTransitionEnd={handleTransitionEnd}
      overflowX="hidden"
      position="absolute"
      spacing={0}
      top={0}
      transition="width 0.3s ease"
      w={`${width}px`}
      zIndex={10}
    >
      <HStack justifyContent="flex-end" w="full">
        {isHeaderShowing && (
          <HStack flexGrow={1} px={2} spacing={1} w="full">
            <KibisisIcon
              boxSize={calculateIconSize('md')}
              color={primaryColor}
            />
            <Text color={defaultTextColor} fontSize="sm">
              {__APP_TITLE__}
            </Text>
          </HStack>
        )}

        <IconButton
          aria-label="Open drawer"
          borderRadius={0}
          colorMode={colorMode}
          colorScheme="gray"
          icon={isOpen ? IoChevronBack : IoChevronForward}
          minW={`${SIDEBAR_MIN_WIDTH}px`}
          onClick={handleOpenToggleClick}
          variant="ghost"
        />
      </HStack>

      <Divider />

      {/*groups/accounts*/}
      <ScrollableContainer
        direction="column"
        flexGrow={1}
        m={0}
        p={0}
        spacing={0}
        w="full"
      >
        {!network || fetchingAccounts ? (
          Array.from({ length: 3 }, (_, index) => (
            <SideBarSkeletonItem key={`sidebar-fetching-item-${index}`} />
          ))
        ) : (
          <>
            {/*groups*/}
            {groups.length > 0 && (
              <>
                <SideBarGroupList
                  accounts={accounts}
                  activeAccountID={activeAccount?.id || null}
                  colorMode={colorMode}
                  groups={groups}
                  isShortForm={!isOpen}
                  network={network}
                  onAccountClick={handleOnAccountClick}
                  onAccountSort={handleOnAccountSort}
                  onGroupSort={handleOnGroupSort}
                  onRemoveAccountFromGroupClick={handleOnRemoveFromGroupClick}
                  systemInfo={systemInfo}
                />
                <Divider />
              </>
            )}

            {/*accounts*/}
            <SideBarAccountList
              accounts={accounts}
              activeAccountID={activeAccount?.id || null}
              colorMode={colorMode}
              isShortForm={!isOpen}
              network={network}
              onAccountClick={handleOnAccountClick}
              onAddToGroupClick={handleOnAddToGroupClick}
              onSort={handleOnAccountSort}
              systemInfo={systemInfo}
            />
          </>
        )}
      </ScrollableContainer>

      <Divider />

      {/*send asset*/}
      {accounts.some((value) => !value.watchAccount) && (
        <SideBarActionItem
          icon={IoSendOutline}
          isShortForm={!isOpen}
          label={t<string>('labels.sendAsset', {
            nativeCurrency: network?.nativeCurrency.symbol,
          })}
          onClick={handleSendAssetClick}
        />
      )}

      {/*scan qr code*/}
      <SideBarActionItem
        icon={IoScanOutline}
        isShortForm={!isOpen}
        label={t<string>('labels.scanQRCode')}
        onClick={handleScanQRCodeClick}
      />

      {/*add account*/}
      <SideBarActionItem
        icon={IoAddCircleOutline}
        isShortForm={!isOpen}
        label={t<string>('labels.addAccount')}
        onClick={handleAddAccountClick}
      />

      {/*manage groups*/}
      <SideBarActionItem
        icon={IoFolderOutline}
        isShortForm={!isOpen}
        label={t<string>('labels.manageGroups')}
        onClick={handleOnManageGroupsClick}
      />

      {/*settings*/}
      <SideBarActionItem
        icon={IoSettingsOutline}
        isShortForm={!isOpen}
        label={t<string>('labels.settings')}
        onClick={handleSettingsClick}
      />
    </VStack>
  );
};

export default SideBar;
