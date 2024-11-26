import { Spacer, TabPanel, VStack } from '@chakra-ui/react';
import { randomString } from '@stablelib/random';
import React, { type FC, type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AssetTabLoadingItem from '@extension/components/AssetTabLoadingItem';
import EmptyState from '@extension/components/EmptyState';
import Item from './Item';
import ScrollableContainer from '@extension/components/ScrollableContainer';
import TabControlBar from '@extension/components/TabControlBar';

// constants
import { ACCOUNT_PAGE_TAB_CONTENT_HEIGHT } from '@extension/constants';

// types
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
  // renders
  const renderContent = () => {
    let nodes: ReactNode[] = [];

    if (fetching) {
      return Array.from({ length: 3 }, (_, index) => (
        <AssetTabLoadingItem key={`${_context}-loading-item-${index}`} />
      ));
    }

    if (stakingApps.length > 0) {
      nodes = stakingApps.map((value, index) => (
        <Item
          app={value}
          colorMode={colorMode}
          key={`${_context}-item-${index}`}
          network={network}
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
        <EmptyState text={t<string>('headings.noStakingAppsFound')} />

        <Spacer />
      </VStack>
    );
  };

  return (
    <TabPanel
      height={ACCOUNT_PAGE_TAB_CONTENT_HEIGHT}
      m={0}
      p={0}
      sx={{ display: 'flex', flexDirection: 'column' }}
      w="full"
    >
      {/*controls*/}
      <TabControlBar
        _context={_context}
        buttons={[]}
        isLoading={fetching}
        loadingTooltipLabel={t<string>('captions.updatingStakingApps')}
      />

      {renderContent()}
    </TabPanel>
  );
};

export default StakingTab;
