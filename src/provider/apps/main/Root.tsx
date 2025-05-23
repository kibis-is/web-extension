import React, { type FC, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

// components
import MainLayout from '@provider/containers/MainLayout';

// features
import { reset as resetAddAsset } from '@provider/features/add-assets';
import { startPollingForAccountsThunk } from '@provider/features/accounts';
import { fetchARC0072AssetsFromStorageThunk } from '@provider/features/arc0072-assets';
import { fetchARC0200AssetsFromStorageThunk } from '@provider/features/arc0200-assets';
import { openConfirmModal, setScanQRCodeModal, setWhatsNewModal } from '@provider/features/layout';
import { closeModal as closeManageGroupsModal } from '@provider/features/manage-groups-modal';
import { closeModal as closeMoveGroupModal } from '@provider/features/move-group-modal';
import { startPollingForTransactionsParamsThunk } from '@provider/features/networks';
import { setShowingConfetti } from '@provider/features/notifications';
import { reset as resetReKeyAccount } from '@provider/features/re-key-account';
import { reset as resetRemoveAssets } from '@provider/features/remove-assets';
import { reset as resetSendAsset } from '@provider/features/send-assets';
import { setI18nAction, startPollingForNetworkConnectivityThunk } from '@provider/features/system';

// hooks
import useOnAppStartup from '@provider/hooks/useOnAppStartup';
import useOnDebugLogging from '@provider/hooks/useOnDebugLogging';
import useOnMainAppMessage from '@provider/hooks/useOnMainAppMessage';
import useOnNewAssets from '@provider/hooks/useOnNewAssets';
import useNotifications from '@provider/hooks/useNotifications';

// modals
import AddAssetsModal, { AddAssetsForWatchAccountModal } from '@provider/modals/AddAssetsModal';
import ARC0300KeyRegistrationTransactionSendEventModal from '@provider/modals/ARC0300KeyRegistrationTransactionSendEventModal';
import ConfirmModal from '@provider/modals/ConfirmModal';
import CredentialLockModal from '@provider/modals/CredentialLockModal';
import EnableModal from '@provider/modals/EnableModal';
import ManageGroupsModal from '@provider/modals/ManageGroupsModal';
import MoveGroupModal from '@provider/modals/MoveGroupModal';
import ReKeyAccountModal from '@provider/modals/ReKeyAccountModal';
import RemoveAssetsModal from '@provider/modals/RemoveAssetsModal';
import ScanQRCodeModal from '@provider/modals/ScanQRCodeModal';
import SendAssetModal from '@provider/modals/SendAssetModal';
import SignMessageModal from '@provider/modals/SignMessageModal';
import SignTransactionsModal from '@provider/modals/SignTransactionsModal';
import WebAuthnAuthenticateModal from '@provider/modals/WebAuthnAuthenticateModal';
import WebAuthnRegisterModal from '@provider/modals/WebAuthnRegisterModal';
import WhatsNewModal from '@provider/modals/WhatsNewModal';

// selectors
import { useSelectNotificationsShowingConfetti, useSelectSystemWhatsNewInfo } from '@provider/selectors';

// types
import type { IAppThunkDispatch, IMainRootState, IRootProps } from '@provider/types';

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
      {showingConfetti && <Confetti onConfettiComplete={handleConfettiComplete} recycle={false} />}

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
