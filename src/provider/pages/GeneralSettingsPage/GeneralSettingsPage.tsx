import { VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import PageHeader from '@provider/components/PageHeader';
import SettingsButtonItem from '@provider/components/SettingsButtonItem';
import SettingsSelectItem from '@provider/components/SettingsSelectItem';
import SettingsSubHeading from '@provider/components/SettingsSubHeading';

// constants
import { DEFAULT_GAP } from '@common/constants';

// features
import { openConfirmModal } from '@provider/features/layout';
import { sendFactoryResetThunk } from '@provider/features/messages';
import { saveToStorageThunk as saveSettingsToStorageThunk } from '@provider/features/settings';

// models
import BaseBlockExplorer from '@provider/models/BaseBlockExplorer';
import BaseNFTExplorer from '@provider/models/BaseNFTExplorer';

// selectors
import {
  useSelectSettingsSelectedNetwork,
  useSelectSettings,
  useSelectSettingsPreferredBlockExplorer,
  useSelectSettingsPreferredNFTExplorer,
  useSelectSettingsColorMode,
} from '@provider/selectors';

// types
import type { IOption } from '@provider/components/Select';
import type { IAppThunkDispatch, IMainRootState } from '@provider/types';

// utils
import convertGenesisHashToHex from '@provider/utils/convertGenesisHashToHex';

const GeneralSettingsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const colorMode = useSelectSettingsColorMode();
  const network = useSelectSettingsSelectedNetwork();
  const preferredBlockExplorer = useSelectSettingsPreferredBlockExplorer();
  const preferredNFTExplorer = useSelectSettingsPreferredNFTExplorer();
  const settings = useSelectSettings();
  // misc
  const _context = 'general-settings-page';
  const blockExplorerOptions: IOption<string>[] =
    network?.blockExplorers.map((value) => ({
      label: value.canonicalName,
      value: value.id,
    })) || [];
  const nftExplorerOptions: IOption<string>[] =
    network?.nftExplorers.map((value) => ({
      label: value.canonicalName,
      value: value.id,
    })) || [];
  // handlers
  const handleClearAllDataClick = () =>
    dispatch(
      openConfirmModal({
        description: t<string>('captions.factoryResetModal'),
        onConfirm: () => dispatch(sendFactoryResetThunk()), // dispatch an event to the background
        title: t<string>('headings.factoryReset'),
        warningText: t<string>('captions.factoryResetWarning'),
      })
    );
  const handlePreferredBlockExplorerChange = (option: IOption<string>) => {
    let explorer: BaseBlockExplorer | null;

    if (network) {
      explorer = network.blockExplorers.find((value) => value.id === option.value) || null;

      if (explorer) {
        dispatch(
          saveSettingsToStorageThunk({
            ...settings,
            general: {
              ...settings.general,
              preferredBlockExplorerIds: {
                ...settings.general.preferredBlockExplorerIds,
                [convertGenesisHashToHex(network.genesisHash).toUpperCase()]: explorer.id,
              },
            },
          })
        );
      }
    }
  };
  const handlePreferredNFTExplorerChange = (option: IOption<string>) => {
    let explorer: BaseNFTExplorer | null;

    if (network) {
      explorer = network.nftExplorers.find((value) => value.id === option.value) || null;

      if (explorer) {
        dispatch(
          saveSettingsToStorageThunk({
            ...settings,
            general: {
              ...settings.general,
              preferredNFTExplorerIds: {
                ...settings.general.preferredNFTExplorerIds,
                [convertGenesisHashToHex(network.genesisHash).toUpperCase()]: explorer.id,
              },
            },
          })
        );
      }
    }
  };

  return (
    <>
      {/*header*/}
      <PageHeader colorMode={colorMode} title={t<string>('titles.page', { context: 'general' })} />

      {/*content*/}
      <VStack spacing={DEFAULT_GAP - 2} w="full">
        {/* network */}
        <VStack w="full">
          <SettingsSubHeading text={t<string>('headings.network')} />

          {/* preferred block explorer */}
          <SettingsSelectItem
            colorMode={colorMode}
            description={t<string>('captions.preferredBlockExplorer')}
            emptyOptionLabel={t<string>('captions.noBlockExplorersAvailable')}
            label={t<string>('labels.preferredBlockExplorer')}
            onChange={handlePreferredBlockExplorerChange}
            options={blockExplorerOptions}
            value={
              blockExplorerOptions.find((value) => value.value === preferredBlockExplorer?.id) ||
              blockExplorerOptions[0]
            }
          />

          {/* preferred nft explorer */}
          <SettingsSelectItem
            colorMode={colorMode}
            description={t<string>('captions.preferredNFTExplorer')}
            emptyOptionLabel={t<string>('captions.noNFTExplorersAvailable')}
            label={t<string>('labels.preferredNFTExplorer')}
            onChange={handlePreferredNFTExplorerChange}
            options={nftExplorerOptions}
            value={
              nftExplorerOptions.find((value) => value.value === preferredNFTExplorer?.id) || nftExplorerOptions[0]
            }
          />
        </VStack>

        {/* danger zone */}
        <VStack w="full">
          <SettingsSubHeading color="red.500" text={t<string>('headings.dangerZone')} />

          {/*factory reset button*/}
          <SettingsButtonItem
            buttonLabel={t<string>('buttons.reset')}
            colorMode={colorMode}
            description={t<string>('captions.factoryReset')}
            isWarning={true}
            label={t<string>('labels.factoryReset')}
            onClick={handleClearAllDataClick}
          />
        </VStack>
      </VStack>
    </>
  );
};

export default GeneralSettingsPage;
