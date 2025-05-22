import { type ColorMode, VStack } from '@chakra-ui/react';
import * as CSS from 'csstype';
import React, { type FC } from 'react';
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import PageHeader from '@provider/components/pages/PageHeader';
import SettingsSelectItem from '@provider/components/settings/SettingsSelectItem';

// constants
import { DEFAULT_GAP } from '@common/constants';

// features
import {
  saveToStorageThunk as saveSettingsToStorageThunk,
  sendThemeUpdatedMessageThunk,
} from '@provider/features/settings';

// selectors
import { useSelectSettings, useSelectSettingsColorMode } from '@provider/selectors';

// types
import type { IOption } from '@provider/components/generic/Select';
import type { IAppThunkDispatch, IMainRootState } from '@provider/types';

const AppearanceSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const colorMode = useSelectSettingsColorMode();
  const settings = useSelectSettings();
  // misc
  const themeOptions: IOption<ColorMode>[] = [
    {
      icon: IoMoonOutline,
      label: t<string>('labels.dark'),
      value: 'dark',
    },
    {
      icon: IoSunnyOutline,
      label: t<string>('labels.light'),
      value: 'light',
    },
  ];
  const fontOptions: IOption<CSS.Property.FontFamily>[] = [
    {
      label: 'Nunito',
      value: 'nunito',
    },
    {
      label: 'Anonymous Pro',
      value: 'AnonymousPro',
    },
  ];
  // handlers
  const handleOnFontChange = async ({ value }: IOption<CSS.Property.FontFamily>) => {
    await dispatch(
      saveSettingsToStorageThunk({
        ...settings,
        appearance: {
          ...settings.appearance,
          font: value,
        },
      })
    ).unwrap();
    // send a message
    dispatch(sendThemeUpdatedMessageThunk());
  };
  const handleOnThemeChange = async ({ value }: IOption<ColorMode>) => {
    await dispatch(
      saveSettingsToStorageThunk({
        ...settings,
        appearance: {
          ...settings.appearance,
          theme: value,
        },
      })
    ).unwrap();
    // send a message
    dispatch(sendThemeUpdatedMessageThunk());
  };

  return (
    <>
      <PageHeader colorMode={colorMode} title={t<string>('titles.page', { context: 'appearance' })} />

      <VStack spacing={DEFAULT_GAP - 2} w="full">
        {/*color*/}
        <SettingsSelectItem
          colorMode={colorMode}
          description={t<string>('captions.changeTheme')}
          emptyOptionLabel={t<string>('captions.noThemesAvailable')}
          label={t<string>('labels.theme')}
          onChange={handleOnThemeChange}
          options={themeOptions}
          value={themeOptions.find((value) => value.value === settings.appearance.theme) || themeOptions[0]}
        />

        {/*font*/}
        <SettingsSelectItem
          colorMode={colorMode}
          description={t<string>('captions.changeFont')}
          emptyOptionLabel={t<string>('captions.noFontsAvailable')}
          label={t<string>('labels.font')}
          onChange={handleOnFontChange}
          options={fontOptions}
          value={fontOptions.find((value) => value.value === settings.appearance.font) || fontOptions[0]}
        />
      </VStack>
    </>
  );
};

export default AppearanceSettingsPage;
