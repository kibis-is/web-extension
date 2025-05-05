import { Spacer, TabPanel, VStack } from '@chakra-ui/react';
import { randomString } from '@stablelib/random';
import React, { type FC, type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// components
import EmptyState from '@common/components/EmptyState';
import ScrollableContainer from '@provider/components/ScrollableContainer';
import TabLoadingItem from '@provider/components/TabLoadingItem';
import Item from './Item';

// constants
import { ACCOUNT_PAGE_TAB_CONTENT_HEIGHT } from '@provider/constants';

// hooks
import useAccountInformation from '@provider/hooks/useAccountInformation';

// types
import type { TProps } from './types';

const NFTsTab: FC<TProps> = ({ account, colorMode, fetching, network }) => {
  const { t } = useTranslation();
  // hooks
  const accountInformation = useAccountInformation(account.id);
  // memos
  const context = useMemo(() => randomString(8), []);
  // renders
  const renderContent = () => {
    let nodes: ReactNode[] = [];

    if (fetching) {
      return Array.from({ length: 3 }, (_, index) => (
        <TabLoadingItem key={`${context}-nft-tab-loading-item-${index}`} />
      ));
    }

    if (network && accountInformation) {
      nodes = accountInformation.arc0072AssetHoldings.map((value, index) => (
        <Item item={value} key={`${context}-nfts-tab-item-${index}`} network={network} />
      ));
    }

    return nodes.length > 0 ? (
      // asset list
      <ScrollableContainer direction="column" m={0} pb={8} pt={0} px={0} spacing={0} w="full">
        {nodes}
      </ScrollableContainer>
    ) : (
      <VStack flexGrow={1} w="full">
        <Spacer />

        {/*empty state*/}
        <EmptyState
          colorMode={colorMode}
          description={t<string>('captions.noNFTsFound')}
          text={t<string>('headings.noNFTsFound')}
        />

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
      {renderContent()}
    </TabPanel>
  );
};

export default NFTsTab;
