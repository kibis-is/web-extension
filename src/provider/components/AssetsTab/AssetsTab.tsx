import { Spacer, TabPanel, VStack } from '@chakra-ui/react';
import { randomString } from '@stablelib/random';
import React, { type FC, type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAddCircleOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import EmptyState from '@common/components/EmptyState';
import ScrollableContainer from '@provider/components/ScrollableContainer';
import TabControlBar from '@provider/components/TabControlBar';
import TabLoadingItem from '@provider/components/TabLoadingItem';
import AssetTabARC0200AssetItem from './AssetTabARC0200AssetItem';
import AssetTabStandardAssetItem from './AssetTabStandardAssetItem';

// constants
import { ACCOUNT_PAGE_TAB_CONTENT_HEIGHT } from '@provider/constants';

// features
import { setAccountId as setAddAssetAccountId } from '@provider/features/add-assets';

// hooks
import useAccountInformation from '@provider/hooks/useAccountInformation';

// selectors
import {
  useSelectARC0200AssetsBySelectedNetwork,
  useSelectARC0200AssetsFetching,
  useSelectARC0200AssetsUpdating,
  useSelectStandardAssetsFetching,
  useSelectStandardAssetsBySelectedNetwork,
  useSelectSettingsSelectedNetwork,
  useSelectStandardAssetsUpdating,
  useSelectSettingsColorMode,
} from '@provider/selectors';

// types
import type { IStandardAsset, IARC0200Asset, IAppThunkDispatch, IMainRootState } from '@provider/types';
import type { IAssetHolding, IProps } from './types';

const AssetsTab: FC<IProps> = ({ account, colorMode }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const arc0200Assets = useSelectARC0200AssetsBySelectedNetwork();
  const fetchingARC0200Assets = useSelectARC0200AssetsFetching();
  const fetchingStandardAssets = useSelectStandardAssetsFetching();
  const selectedNetwork = useSelectSettingsSelectedNetwork();
  const standardAssets = useSelectStandardAssetsBySelectedNetwork();
  const updatingARC0200Assets = useSelectARC0200AssetsUpdating();
  const updatingStandardAssets = useSelectStandardAssetsUpdating();
  // hooks
  const accountInformation = useAccountInformation(account.id);
  // memos
  const _context = useMemo(() => randomString(8), []);
  const assetHoldings = useMemo<IAssetHolding[]>(
    () =>
      accountInformation
        ? [
            ...accountInformation.arc200AssetHoldings.map(({ amount, id }) => ({
              amount,
              id,
              isARC0200: true,
            })),
            ...accountInformation.standardAssetHoldings.map(({ amount, id }) => ({
              amount,
              id,
              isARC0200: false,
            })),
          ]
        : [],
    [accountInformation]
  );
  // handlers
  const handleAddAssetClick = () => dispatch(setAddAssetAccountId(account.id));
  // renders
  const renderContent = () => {
    let assetNodes: ReactNode[] = [];

    if (fetchingARC0200Assets || fetchingStandardAssets) {
      return Array.from({ length: 3 }, (_, index) => <TabLoadingItem key={`${_context}-loading-item-${index}`} />);
    }

    if (selectedNetwork && accountInformation && assetHoldings.length > 0) {
      assetNodes = assetHoldings.reduce<ReactNode[]>((acc, { amount, id, isARC0200 }) => {
        const key = `${_context}-item-${id}`;
        let arc200Asset: IARC0200Asset | null;
        let standardAsset: IStandardAsset | null;

        // for standard assets
        if (!isARC0200) {
          standardAsset = standardAssets.find((value) => value.id === id) || null;

          if (!standardAsset) {
            return acc;
          }

          return [
            ...acc,
            <AssetTabStandardAssetItem
              amount={amount}
              key={key}
              network={selectedNetwork}
              standardAsset={standardAsset}
            />,
          ];
        }

        arc200Asset = arc0200Assets.find((value) => value.id === id) || null;

        if (!arc200Asset) {
          return acc;
        }

        return [
          ...acc,
          <AssetTabARC0200AssetItem amount={amount} arc0200Asset={arc200Asset} key={key} network={selectedNetwork} />,
        ];
      }, []);
    }

    return assetNodes.length > 0 ? (
      // asset list
      <ScrollableContainer direction="column" m={0} pb={8} pt={0} px={0} spacing={0} w="full">
        {assetNodes}
      </ScrollableContainer>
    ) : (
      <VStack flexGrow={1} w="full">
        <Spacer />

        {/*empty state*/}
        <EmptyState
          colorMode={colorMode}
          description={t<string>('captions.noAssetsFound')}
          text={t<string>('headings.noAssetsFound')}
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
        buttons={[
          {
            button: {
              ['aria-label']: t<string>('buttons.addAsset'),
              colorMode,
              icon: IoAddCircleOutline,
              onClick: handleAddAssetClick,
              size: 'sm',
              variant: 'ghost',
            },
            tooltipLabel: t<string>('buttons.addAsset'),
          },
        ]}
        colorMode={colorMode}
        isLoading={updatingARC0200Assets || updatingStandardAssets}
        loadingTooltipLabel={t<string>('captions.updatingAssetInformation')}
      />

      {renderContent()}
    </TabPanel>
  );
};

export default AssetsTab;
