import React, { type FC, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

// components
import MainLayout from '@extension/components/MainLayout';

// features
import { reset as resetAddAsset } from '@extension/features/add-assets';
import { startPollingForAccountsThunk } from '@extension/features/accounts';
import { fetchARC0072AssetsFromStorageThunk } from '@extension/features/arc0072-assets';
import { fetchARC0200AssetsFromStorageThunk } from '@extension/features/arc0200-assets';
import {
  openConfirmModal,
  setScanQRCodeModal,
  setWhatsNewModal,
} from '@extension/features/layout';
import { closeModal as closeManageGroupsModal } from '@extension/features/manage-groups-modal';
import { closeModal as closeMoveGroupModal } from '@extension/features/move-group-modal';
import { startPollingForTransactionsParamsThunk } from '@extension/features/networks';
import { setShowingConfetti } from '@extension/features/notifications';
import { reset as resetReKeyAccount } from '@extension/features/re-key-account';
import { reset as resetRemoveAssets } from '@extension/features/remove-assets';
import { reset as resetSendAsset } from '@extension/features/send-assets';
import {
  setI18nAction,
  startPollingForNetworkConnectivityThunk,
} from '@extension/features/system';

// hooks
import useOnAppStartup from '@extension/hooks/useOnAppStartup';
import useOnDebugLogging from '@extension/hooks/useOnDebugLogging';
import useOnMainAppMessage from '@extension/hooks/useOnMainAppMessage';
import useOnNewAssets from '@extension/hooks/useOnNewAssets';
import useNotifications from '@extension/hooks/useNotifications';

// modals
import AddAssetsModal, {
  AddAssetsForWatchAccountModal,
} from '@extension/modals/AddAssetsModal';
import ARC0300KeyRegistrationTransactionSendEventModal from '@extension/modals/ARC0300KeyRegistrationTransactionSendEventModal';
import ConfirmModal from '@extension/modals/ConfirmModal';
import CredentialLockModal from '@extension/modals/CredentialLockModal';
import EnableModal from '@extension/modals/EnableModal';
import ManageGroupsModal from '@extension/modals/ManageGroupsModal';
import MoveGroupModal from '@extension/modals/MoveGroupModal';
import ReKeyAccountModal from '@extension/modals/ReKeyAccountModal';
import RemoveAssetsModal from '@extension/modals/RemoveAssetsModal';
import ScanQRCodeModal from '@extension/modals/ScanQRCodeModal';
import SendAssetModal from '@extension/modals/SendAssetModal';
import SignMessageModal from '@extension/modals/SignMessageModal';
import SignTransactionsModal from '@extension/modals/SignTransactionsModal';
import WebAuthnAuthenticateModal from '@extension/modals/WebAuthnAuthenticateModal';
import WebAuthnRegisterModal from '@extension/modals/WebAuthnRegisterModal';
import WhatsNewModal from '@extension/modals/WhatsNewModal';

// selectors
import {
  useSelectNotificationsShowingConfetti,
  useSelectSystemWhatsNewInfo,
} from '@extension/selectors';

// types
import type {
  IAppThunkDispatch,
  IMainRootState,
  IRootProps,
} from '@extension/types';

const Root: FC<IRootProps> = ({ i18n }) => {
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const showingConfetti = useSelectNotificationsShowingConfetti();
  const whatsNewInfo = useSelectSystemWhatsNewInfo();
  // handlers
  const handleAddAssetsModalClose = () => dispatch(resetAddAsset());
  const handleConfirmClose = () => dispatch(openConfirmModal(null));
  const handleConfettiComplete = () => dispatch(setShowingConfetti(false));
  const handleManageGroupsModalClose = () => dispatch(closeManageGroupsModal());
  const handleMoveGroupModalClose = () => dispatch(closeMoveGroupModal());
  const handleReKeyAccountModalClose = () => dispatch(resetReKeyAccount());
  const handleRemoveAssetsModalClose = () => dispatch(resetRemoveAssets());
  const handleScanQRCodeModalClose = () => dispatch(setScanQRCodeModal(null));
  const handleSendAssetModalClose = () => dispatch(resetSendAsset());
  const handleWhatsNewModalClose = () => dispatch(setWhatsNewModal(false));

  useOnAppStartup();
  useEffect(() => {
    dispatch(setI18nAction(i18n));
    // assets
    dispatch(fetchARC0072AssetsFromStorageThunk());
    dispatch(fetchARC0200AssetsFromStorageThunk());
    // polling
    dispatch(startPollingForAccountsThunk());
    dispatch(startPollingForTransactionsParamsThunk());
    dispatch(startPollingForNetworkConnectivityThunk());
  }, []);

  // if the saved what's new version is null or less than the current version (and the update message is not disabled), display the modal
  useEffect(() => {
    if (
      whatsNewInfo &&
      !whatsNewInfo.disableOnUpdate &&
      (!whatsNewInfo.version || whatsNewInfo.version !== __VERSION__)
    ) {
      dispatch(setWhatsNewModal(true));
    }
  }, [whatsNewInfo]);
  useOnDebugLogging();
  useOnNewAssets(); // handle new assets added
  useNotifications(); // handle notifications
  useOnMainAppMessage(); // handle incoming messages

  return (
    <>
      {showingConfetti && (
        <Confetti onConfettiComplete={handleConfettiComplete} recycle={false} />
      )}

      {/*top-level modals*/}
      <CredentialLockModal />
      <ConfirmModal onClose={handleConfirmClose} />

      {/*event modals*/}
      <EnableModal />
      <SignMessageModal />
      <SignTransactionsModal />
      <ARC0300KeyRegistrationTransactionSendEventModal />
      <WebAuthnRegisterModal />
      <WebAuthnAuthenticateModal />

      {/*information modals*/}
      <WhatsNewModal onClose={handleWhatsNewModalClose} />

      {/*action modals*/}
      <AddAssetsModal onClose={handleAddAssetsModalClose} />
      <AddAssetsForWatchAccountModal onClose={handleAddAssetsModalClose} />
      <ManageGroupsModal onClose={handleManageGroupsModalClose} />
      <MoveGroupModal onClose={handleMoveGroupModalClose} />
      <ReKeyAccountModal onClose={handleReKeyAccountModalClose} />
      <RemoveAssetsModal onClose={handleRemoveAssetsModalClose} />
      <SendAssetModal onClose={handleSendAssetModalClose} />
      <ScanQRCodeModal onClose={handleScanQRCodeModalClose} />

      {/*main*/}
      <MainLayout>
        <Outlet />
      </MainLayout>
    </>
  );
};

export default Root;
