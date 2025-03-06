import { VStack } from '@chakra-ui/react';
import React, { type ChangeEvent, type FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { IoGlobeOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import PageHeader from '@extension/components/PageHeader';
import SettingsLinkItem from '@extension/components/SettingsLinkItem';
import SettingsSubHeading from '@extension/components/SettingsSubHeading';
import SettingsSwitchItem from '@extension/components/SettingsSwitchItem';

// enums
import { AccountTabEnum } from '@extension/enums';

// constants
import { DEFAULT_GAP } from '@common/constants';
import {
  ADVANCED_ROUTE,
  CUSTOM_NODES_ROUTE,
  SETTINGS_ROUTE,
} from '@extension/constants';

// features
import { saveActiveAccountDetails } from '@extension/features/accounts';
import { saveToStorageThunk as saveSettingsToStorageThunk } from '@extension/features/settings';

// selectors
import {
  useSelectActiveAccountDetails,
  useSelectSettings,
  useSelectSettingsColorMode,
} from '@extension/selectors';

// types
import type {
  IAdvancedSettings,
  IAppThunkDispatch,
  IMainRootState,
} from '@extension/types';

const AdvancedSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const activeAccountDetails = useSelectActiveAccountDetails();
  const colorMode = useSelectSettingsColorMode();
  const settings = useSelectSettings();
  // handlers
  const handleOnSwitchChange =
    (key: keyof IAdvancedSettings) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        saveSettingsToStorageThunk({
          ...settings,
          advanced: {
            ...settings.advanced,
            [key]: event.target.checked,
          },
        })
      );
    };
  const handleOnAllowAccountPasskeysChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      // if we are disabling, we need to reset the account page tab
      if (
        !event.target.checked &&
        activeAccountDetails?.tabIndex === AccountTabEnum.Passkeys
      ) {
        dispatch(
          saveActiveAccountDetails({
            ...activeAccountDetails,
            tabIndex: AccountTabEnum.Assets,
          })
        );
      }

      dispatch(
        saveSettingsToStorageThunk({
          ...settings,
          advanced: {
            ...settings.advanced,
            allowAccountPasskeys: event.target.checked,
          },
        })
      );
    },
    [activeAccountDetails, settings]
  );

  return (
    <>
      <PageHeader
        colorMode={colorMode}
        title={t<string>('titles.page', { context: 'advanced' })}
      />

      <VStack spacing={DEFAULT_GAP - 2} w="full">
        {/*networks*/}
        <VStack w="full">
          <SettingsSubHeading text={t<string>('headings.networks')} />

          {/*custom nodes*/}
          <SettingsLinkItem
            icon={IoGlobeOutline}
            label={t<string>('titles.page', { context: 'customNodes' })}
            to={`${SETTINGS_ROUTE}${ADVANCED_ROUTE}${CUSTOM_NODES_ROUTE}`}
          />
        </VStack>

        {/*developer*/}
        <VStack w="full">
          <SettingsSubHeading text={t<string>('headings.developer')} />

          <SettingsSwitchItem
            checked={settings.advanced.debugLogging}
            description={t<string>('captions.debugLogging')}
            label={t<string>('labels.debugLogging')}
            onChange={handleOnSwitchChange('debugLogging')}
          />
        </VStack>

        {/*experimental*/}
        <VStack w="full">
          <SettingsSubHeading text={t<string>('headings.experimental')} />

          <SettingsSwitchItem
            checked={settings.advanced.allowBetaNet}
            description={t<string>('captions.allowBetaNet')}
            label={t<string>('labels.allowBetaNet')}
            onChange={handleOnSwitchChange('allowBetaNet')}
          />

          <SettingsSwitchItem
            checked={settings.advanced.allowTestNet}
            description={t<string>('captions.allowTestNet')}
            label={t<string>('labels.allowTestNet')}
            onChange={handleOnSwitchChange('allowTestNet')}
          />

          <SettingsSwitchItem
            checked={settings.advanced.allowDidTokenFormat}
            description={t<string>('captions.allowDidTokenFormat')}
            label={t<string>('labels.allowDidTokenFormat')}
            onChange={handleOnSwitchChange('allowDidTokenFormat')}
          />

          <SettingsSwitchItem
            checked={settings.advanced.allowAccountPasskeys}
            description={t<string>('captions.allowAccountPasskeys')}
            label={t<string>('labels.allowAccountPasskeys')}
            onChange={handleOnAllowAccountPasskeysChange}
          />
        </VStack>
      </VStack>
    </>
  );
};

export default AdvancedSettingsPage;
