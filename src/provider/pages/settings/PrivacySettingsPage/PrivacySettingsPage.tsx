import { VStack } from '@chakra-ui/react';
import React, { type ChangeEvent, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import PageHeader from '@provider/components/PageHeader';
import SettingsExternalLinkItem from '@provider/components/settings/SettingsExternalLinkItem';
import SettingsSubHeading from '@provider/components/settings/SettingsSubHeading';
import SettingsSwitchItem from '@provider/components/settings/SettingsSwitchItem';

// constants
import { DEFAULT_GAP } from '@common/constants';
import { KIBISIS_LINK } from '@provider/constants';

// features
import { saveToStorageThunk as saveSettingsToStorageThunk } from '@provider/features/settings';

// selectors
import { useSelectSettings, useSelectSettingsColorMode } from '@provider/selectors';

// types
import type { IAppThunkDispatch, IMainRootState, IPrivacySettings } from '@provider/types';

const PrivacySettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const colorMode = useSelectSettingsColorMode();
  const settings = useSelectSettings();
  // handlers
  const handleOnSwitchChange = (key: keyof IPrivacySettings) => (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      saveSettingsToStorageThunk({
        ...settings,
        privacy: {
          ...settings.privacy,
          [key]: event.target.checked,
        },
      })
    );
  };

  return (
    <>
      <PageHeader colorMode={colorMode} title={t<string>('titles.page', { context: 'privacy' })} />

      <VStack spacing={DEFAULT_GAP - 2} w="full">
        {/*information*/}
        <VStack w="full">
          <SettingsSubHeading text={t<string>('headings.information')} />

          {/*privacy policy link*/}
          <SettingsExternalLinkItem label={t<string>('labels.privacyPolicy')} to={`${KIBISIS_LINK}/privacy-policy`} />
        </VStack>
      </VStack>
    </>
  );
};

export default PrivacySettingsPage;
