import { Spacer, TabPanel, VStack } from '@chakra-ui/react';
import { randomString } from '@stablelib/random';
import React, { type FC, type ReactNode, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import EmptyState from '@common/components/EmptyState';
import Item from './Item';
import ScrollableContainer from '@extension/components/ScrollableContainer';
import TabLoadingItem from '@extension/components/TabLoadingItem';

// constants
import { ACCOUNT_PAGE_TAB_CONTENT_HEIGHT } from '@extension/constants';

// selectors
import {
  useSelectAccountsFetching,
  useSelectSettingsColorMode,
} from '@extension/selectors';

// types
import type { IAppThunkDispatch, IMainRootState } from '@extension/types';
import type { IProps } from './types';

const PasskeysTab: FC<IProps> = ({ account }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const colorMode = useSelectSettingsColorMode();
  const fetching = useSelectAccountsFetching();
  // memos
  const _context = useMemo(() => randomString(8), []);
  // handlers
  const handleOnRemoveClick = useCallback((id: string) => {
    return () => {};
  }, []);
  const handleOnViewClick = useCallback((id: string) => {
    return () => {};
  }, []);
  // renders
  const renderContent = () => {
    let nodes: ReactNode[] = [];

    if (fetching) {
      return Array.from({ length: 3 }, (_, index) => (
        <TabLoadingItem key={`${_context}-loading-item-${index}`} />
      ));
    }

    if (account.passkeys && account.passkeys.length > 0) {
      nodes = account.passkeys.map((value) => (
        <Item
          key={`${_context}-${value.id}`}
          onRemoveClick={handleOnRemoveClick(value.id)}
          onViewClick={handleOnViewClick(value.id)}
          passkey={value}
        />
      ));
    }

    return nodes.length > 0 ? (
      // passkey list
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
    ) : (
      <VStack flexGrow={1} w="full">
        <Spacer />

        {/*empty state*/}
        <EmptyState
          colorMode={colorMode}
          text={t<string>('headings.noPasskeysFound')}
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

export default PasskeysTab;
