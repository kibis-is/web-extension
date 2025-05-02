import { Spacer, TabPanel, VStack } from '@chakra-ui/react';
import { randomString } from '@stablelib/random';
import React, { type FC, type ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

// components
// import AssetTabLoadingItem from '@extension/components/AssetTabLoadingItem';
import EmptyState from '@common/components/EmptyState';
import ScrollableContainer from '@extension/components/ScrollableContainer';
import TabControlBar from '@extension/components/TabControlBar';
import Item from './Item';

// constants
import { ACCOUNT_PAGE_TAB_CONTENT_HEIGHT } from '@extension/constants';

// modals
import StakingAppModal from '@extension/modals/StakingAppModal';

// types
import type { IAccountStakingApp } from '@extension/types';
import type { IProps } from './types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

const StakingTab: FC<IProps> = ({ account, colorMode, fetching, network }) => {
  const { t } = useTranslation();
  // memos
  const _context = useMemo(() => randomString(8), []);
  const stakingApps = useMemo(
    () =>
      account.networkStakingApps[convertGenesisHashToHex(network.genesisHash)]
        ?.apps || null,
    [account, network]
  );
  // states
  const [selectedStakingApp, setSelectedStakingApp] =
    useState<IAccountStakingApp | null>(null);
  // handlers
  const handleOnSelectStakingApp = (id: string) =>
    setSelectedStakingApp(
      stakingApps?.find(({ appID }) => appID === id) || null
    );
  const handleOnStakingAppModalClose = () => setSelectedStakingApp(null);
  // renders
  const renderContent = () => {
    let nodes: ReactNode[] = [];

    if (fetching) {
      return Array.from({ length: 3 }, (_, index) => (
        // <AssetTabLoadingItem key={`${_context}-loading-item-${index}`} />
        <div></div>
      ));
    }

    if (stakingApps.length > 0) {
      nodes = stakingApps.map((value, index) => (
        <Item
          app={value}
          colorMode={colorMode}
          key={`${_context}-item-${index}`}
          network={network}
          onClick={handleOnSelectStakingApp}
        />
      ));
    }

    return nodes.length > 0 ? (
      <>
        <ScrollableContainer
          direction="column"
          m={0}
          pb={8}
          pt={0}
          px={0}
          spacing={0}
          w="full"
        >
          {nodes}
        </ScrollableContainer>
      </>
    ) : (
      <VStack flexGrow={1} w="full">
        <Spacer />

        {/*empty state*/}
        <EmptyState
          colorMode={colorMode}
          text={t<string>('headings.noStakingAppsFound')}
        />

        <Spacer />
      </VStack>
    );
  };

  return (
    <>
      <StakingAppModal
        app={selectedStakingApp}
        network={network}
        onClose={handleOnStakingAppModalClose}
      />

      <TabPanel
        height={ACCOUNT_PAGE_TAB_CONTENT_HEIGHT}
        m={0}
        p={0}
        sx={{ display: 'flex', flexDirection: 'column' }}
        w="full"
      >
        {/*controls*/}
        <TabControlBar
          colorMode={colorMode}
          buttons={[]}
          isLoading={fetching}
          loadingTooltipLabel={t<string>('captions.updatingStakingApps')}
        />

        {renderContent()}
      </TabPanel>
    </>
  );
};

export default StakingTab;
