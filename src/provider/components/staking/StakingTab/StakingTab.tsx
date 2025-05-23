import { Spacer, TabPanel, VStack } from '@chakra-ui/react';
import { randomString } from '@stablelib/random';
import React, { type FC, type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// components
import EmptyState from '@common/components/EmptyState';
import ScrollableContainer from '@provider/components/generic/ScrollableContainer';
import TabControlBar from '@provider/components/generic/TabControlBar';
import TabLoadingItem from '@provider/components/generic/TabLoadingItem';
import Item from './Item';

// constants
import { ACCOUNT_PAGE_TAB_CONTENT_HEIGHT } from '@provider/constants';

// types
import type { TProps } from './types';

const StakingTab: FC<TProps> = ({ colorMode, fetching, network, onViewClick, stakingApps }) => {
  const { t } = useTranslation();
  // memos
  const context = useMemo(() => randomString(8), []);
  // renders
  const renderContent = () => {
    let nodes: ReactNode[] = [];

    if (fetching) {
      return Array.from({ length: 3 }, (_, index) => <TabLoadingItem key={`${context}-loading-item-${index}`} />);
    }

    if (stakingApps.length > 0) {
      nodes = stakingApps.map((value, index) => (
        <Item
          app={value}
          colorMode={colorMode}
          key={`${context}-item-${index}`}
          network={network}
          onClick={onViewClick}
        />
      ));
    }

    return nodes.length > 0 ? (
      <>
        <ScrollableContainer direction="column" m={0} pb={8} pt={0} px={0} spacing={0} w="full">
          {nodes}
        </ScrollableContainer>
      </>
    ) : (
      <VStack flexGrow={1} w="full">
        <Spacer />

        {/*empty state*/}
        <EmptyState colorMode={colorMode} text={t<string>('headings.noStakingAppsFound')} />

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
        colorMode={colorMode}
        buttons={[]}
        isLoading={fetching}
        loadingTooltipLabel={t<string>('captions.updatingStakingApps')}
      />

      {renderContent()}
    </TabPanel>
  );
};

export default StakingTab;
