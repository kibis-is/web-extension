import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';

// constants
import {
  CREATE_NEW_ACCOUNT_ROUTE,
  CREATE_PASSWORD_ROUTE,
  IMPORT_ACCOUNT_VIA_SEED_PHRASE_ROUTE,
} from '@provider/constants';

// enums
import { ErrorCodeEnum } from '@provider/enums';

// features
import { sendRegistrationCompletedThunk } from '@provider/features/messages';
import { create as createNotification } from '@provider/features/notifications';
import { saveCredentialsThunk, setImportAccountViaQRCodeOpen } from '@provider/features/registration';

// modals
import RegistrationImportAccountViaQRCodeModal from '@provider/modals/RegistrationImportAccountViaQRCodeModal';

// pages
import AddAccountTypePage from '@provider/pages/AddAccountTypePage';
import CreateNewAccountPage from '@provider/pages/CreateNewAccountPage';
import ImportAccountViaSeedPhrasePage from '@provider/pages/ImportAccountViaSeedPhrasePage';

// selectors
import { useSelectRegistrationImportAccountViaQRCodeOpen, useSelectRegistrationSaving } from '@provider/selectors';

// types
import type { IAppThunkDispatch, INewAccount, IRegistrationRootState } from '@provider/types';

const AddAccountRegistrationRouter: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IRegistrationRootState>>();
  const navigate = useNavigate();
  // selectors
  const importAccountViaQRCodeOpen = useSelectRegistrationImportAccountViaQRCodeOpen();
  const saving = useSelectRegistrationSaving();
  // misc
  const saveNewAccount = async (accounts: INewAccount[]) => {
    try {
      await dispatch(saveCredentialsThunk(accounts)).unwrap();

      // send a message that registration has been completed
      dispatch(sendRegistrationCompletedThunk());
    } catch (error) {
      switch (error.code) {
        case ErrorCodeEnum.InvalidPasswordError:
          navigate(CREATE_PASSWORD_ROUTE);

          break;
        default:
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

          break;
      }
    }
  };
  // handlers
  const handleOnImportAccountViaQRCodeComplete = async (accounts: INewAccount[]) => await saveNewAccount(accounts);
  const handleOnAddAccountComplete = async (account: INewAccount) => await saveNewAccount([account]);
  const handleOnImportAccountViaQRCodeClose = () => dispatch(setImportAccountViaQRCodeOpen(false));
  const handleOnImportAccountViaQRCodeOpen = () => dispatch(setImportAccountViaQRCodeOpen(true));

  return (
    <>
      <RegistrationImportAccountViaQRCodeModal
        isOpen={importAccountViaQRCodeOpen}
        onClose={handleOnImportAccountViaQRCodeClose}
        onComplete={handleOnImportAccountViaQRCodeComplete}
        saving={saving}
      />

      <Routes>
        {/*add account type page*/}
        <Route
          element={
            <AddAccountTypePage
              allowAddWatchAccount={false}
              onImportAccountViaQRCodeClick={handleOnImportAccountViaQRCodeOpen}
            />
          }
          path="/"
        />

        {/*create account page*/}
        <Route
          element={<CreateNewAccountPage onComplete={handleOnAddAccountComplete} saving={saving} />}
          path={CREATE_NEW_ACCOUNT_ROUTE}
        />

        {/*import account via seed phrase page*/}
        <Route
          element={<ImportAccountViaSeedPhrasePage onComplete={handleOnAddAccountComplete} saving={saving} />}
          path={IMPORT_ACCOUNT_VIA_SEED_PHRASE_ROUTE}
        />
      </Routes>
    </>
  );
};

export default AddAccountRegistrationRouter;
