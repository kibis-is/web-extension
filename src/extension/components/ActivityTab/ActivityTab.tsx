import { Spacer, TabPanel, VStack } from '@chakra-ui/react';
import { randomString } from '@stablelib/random';
import React, { type FC, type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// components
import EmptyState from '@common/components/EmptyState';
import ScrollableContainer from '@extension/components/ScrollableContainer';
import TabControlBar from '@extension/components/TabControlBar';
import TransactionItem, {
  TransactionItemSkeleton,
} from '@extension/components/TransactionItem';

// constants
import { ACCOUNT_PAGE_TAB_CONTENT_HEIGHT } from '@extension/constants';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// types
import type { IProps } from './types';

const ActivityTab: FC<IProps> = ({
  account,
  accounts,
  colorMode,
  fetching,
  network,
  onRefreshClick,
  onScrollEnd,
  updating,
}) => {
  const { t } = useTranslation();
  // memos
  const _context = useMemo(() => randomString(8), []);
  // misc
  const transactions =
    AccountRepository.extractAccountTransactionsForNetwork(account, network)
      ?.transactions || null;
  // handlers
  const handleOnRefreshClick = () => onRefreshClick();
  const handleScrollEnd = () => onScrollEnd();
  // renders
  const renderContent = () => {
    let nodes: ReactNode[] = [];

    if (transactions) {
      nodes = transactions.map((value, index) => (
        <TransactionItem
          account={account}
          accounts={accounts}
          key={`${_context}-activity-tab-item-${index}`}
          network={network}
          transaction={value}
        />
      ));

      // if the account transaction is fetching some more transactions, append a few loading skeletons`
      if (fetching) {
        nodes = [
          ...nodes,
          ...Array.from({ length: 3 }, (_, index) => (
            <TransactionItemSkeleton
              key={`${_context}-loading-item-${index}`}
            />
          )),
        ];
      }
    }

    return nodes.length > 0 ? (
      <ScrollableContainer
        direction="column"
        m={0}
        onScrollEnd={handleScrollEnd}
        pb={8}
        pt={0}
        px={0}
        spacing={0}
        w="full"
      >
        {nodes}
      </ScrollableContainer>
    ) : (
      <VStack flexGrow={1} w="full">
        <Spacer />

        {/* empty state */}
        <EmptyState
          colorMode={colorMode}
          text={t<string>('headings.noTransactionsFound')}
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
      {/*controls*/}
      <TabControlBar
        buttons={[]}
        colorMode={colorMode}
        isLoading={updating}
        loadingTooltipLabel={t<string>('captions.updatingTransactions')}
        onRefresh={handleOnRefreshClick}
      />

      {renderContent()}
    </TabPanel>
  );
};

export default ActivityTab;
