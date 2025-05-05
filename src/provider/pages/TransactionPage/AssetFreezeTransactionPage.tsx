import { Code, HStack, Text, Tooltip, useDisclosure, VStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@provider/components/AddressDisplay';
import AssetDisplay from '@provider/components/AssetDisplay';
import CopyIconButton from '@provider/components/CopyIconButton';
import LoadingTransactionPage from '@provider/pages/TransactionPage/LoadingTransactionPage';
import MoreInformationAccordion from '@provider/components/MoreInformationAccordion';
import OpenTabIconButton from '@provider/components/OpenTabIconButton';
import PageHeader from '@provider/components/PageHeader';
import PageItem from '@provider/components/PageItem';

// constants
import { DEFAULT_GAP } from '@common/constants';
import { PAGE_ITEM_HEIGHT } from '@provider/constants';

// enums
import { TransactionTypeEnum } from '@provider/enums';

// hooks
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';
import useStandardAssetById from '@provider/hooks/useStandardAssetById';
import useSubTextColor from '@provider/hooks/useSubTextColor';

// selectors
import { useSelectSettingsColorMode, useSelectSettingsPreferredBlockExplorer } from '@provider/selectors';

// types
import type { IAssetFreezeTransaction, IAssetUnfreezeTransaction } from '@provider/types';
import type { IProps } from './types';

// utils
import createIconFromDataUri from '@provider/utils/createIconFromDataUri';
import ellipseAddress from '@common/utils/ellipseAddress';
import isAccountKnown from '@provider/utils/isAccountKnown';

const AssetTransferTransactionContent: FC<IProps<IAssetFreezeTransaction | IAssetUnfreezeTransaction>> = ({
  accounts,
  network,
  transaction,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // selectors
  const colorMode = useSelectSettingsColorMode();
  const preferredExplorer = useSelectSettingsPreferredBlockExplorer();
  // hooks
  const { standardAsset, updating } = useStandardAssetById(transaction.assetId);
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // misc
  const explorer =
    network.blockExplorers.find((value) => value.id === preferredExplorer?.id) || network.blockExplorers[0] || null; // get the preferred explorer, if it exists in the networks, otherwise get the default one
  // handlers
  const handleMoreInformationToggle = (value: boolean) => (value ? onOpen() : onClose());

  if (!standardAsset || updating) {
    return <LoadingTransactionPage />;
  }

  return (
    <>
      <PageHeader colorMode={colorMode} title={t<string>('headings.transaction', { context: transaction.type })} />

      <VStack alignItems="flex-start" justifyContent="flex-start" px={DEFAULT_GAP} spacing={DEFAULT_GAP - 2} w="full">
        {/*asset id*/}
        <PageItem fontSize="sm" label={t<string>('labels.assetId')}>
          <HStack spacing={0}>
            <Text color={subTextColor} fontSize="sm">
              {standardAsset.id}
            </Text>
            <CopyIconButton
              ariaLabel={t<string>('labels.copyAssetId')}
              tooltipLabel={t<string>('labels.copyAssetId')}
              size="sm"
              value={standardAsset.id}
            />
            {explorer && (
              <OpenTabIconButton
                size="sm"
                tooltipLabel={t<string>('captions.openOn', {
                  name: explorer.canonicalName,
                })}
                url={explorer.assetURL(standardAsset.id)}
              />
            )}
          </HStack>
        </PageItem>

        {/*frozen account*/}
        <PageItem
          fontSize="sm"
          label={t<string>(
            transaction.type === TransactionTypeEnum.AssetFreeze ? 'labels.accountToFreeze' : 'labels.accountToUnfreeze'
          )}
        >
          <HStack spacing={0}>
            <AddressDisplay
              accounts={accounts}
              address={transaction.frozenAddress}
              ariaLabel="Address to freeze/unfreeze"
              size="sm"
              network={network}
            />

            {/*open in explorer button*/}
            {!isAccountKnown(accounts, transaction.frozenAddress) && explorer && (
              <OpenTabIconButton
                size="sm"
                tooltipLabel={t<string>('captions.openOn', {
                  name: explorer.canonicalName,
                })}
                url={explorer.accountURL(transaction.frozenAddress)}
              />
            )}
          </HStack>
        </PageItem>

        {/*fee*/}
        <PageItem fontSize="sm" label={t<string>('labels.fee')}>
          <AssetDisplay
            atomicUnitAmount={new BigNumber(transaction.fee)}
            amountColor="red.500"
            decimals={network.nativeCurrency.decimals}
            fontSize="sm"
            icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
              color: subTextColor,
              h: 3,
              w: 3,
            })}
            prefix="-"
            unit={network.nativeCurrency.symbol}
          />
        </PageItem>

        {/*completed date*/}
        {transaction.completedAt && (
          <PageItem fontSize="sm" label={t<string>('labels.date')}>
            <Text color={subTextColor} fontSize="sm">
              {new Date(transaction.completedAt).toLocaleString()}
            </Text>
          </PageItem>
        )}

        {/*note*/}
        {transaction.note && (
          <PageItem fontSize="sm" label={t<string>('labels.note')}>
            <Code borderRadius="md" color={defaultTextColor} fontSize="sm" wordBreak="break-word">
              {transaction.note}
            </Code>
          </PageItem>
        )}

        <MoreInformationAccordion
          color={defaultTextColor}
          fontSize="sm"
          isOpen={isOpen}
          minButtonHeight={PAGE_ITEM_HEIGHT}
          onChange={handleMoreInformationToggle}
        >
          <VStack spacing={4} w="full">
            {/*id*/}
            <PageItem fontSize="sm" label={t<string>('labels.id')}>
              {transaction.id ? (
                <HStack spacing={0}>
                  <Tooltip aria-label="The ID of the transaction" label={transaction.id}>
                    <Text color={subTextColor} fontSize="sm">
                      {ellipseAddress(transaction.id, {
                        end: 10,
                        start: 10,
                      })}
                    </Text>
                  </Tooltip>
                  <CopyIconButton
                    ariaLabel={t<string>('labels.copyTransactionId')}
                    tooltipLabel={t<string>('labels.copyTransactionId')}
                    size="sm"
                    value={transaction.id}
                  />
                  {explorer && (
                    <OpenTabIconButton
                      size="sm"
                      tooltipLabel={t<string>('captions.openOn', {
                        name: explorer.canonicalName,
                      })}
                      url={explorer.transactionURL(transaction.id)}
                    />
                  )}
                </HStack>
              ) : (
                <Text color={subTextColor} fontSize="sm">
                  {'-'}
                </Text>
              )}
            </PageItem>

            {/*group id*/}
            {transaction.groupId && (
              <PageItem fontSize="sm" label={t<string>('labels.groupId')}>
                <HStack spacing={0}>
                  <Tooltip aria-label="The group ID of the transaction" label={transaction.groupId}>
                    <Text color={subTextColor} fontSize="sm">
                      {ellipseAddress(transaction.groupId, {
                        end: 10,
                        start: 10,
                      })}
                    </Text>
                  </Tooltip>
                  <CopyIconButton
                    ariaLabel={t<string>('labels.copyGroupId')}
                    tooltipLabel={t<string>('labels.copyGroupId')}
                    size="sm"
                    value={transaction.groupId}
                  />
                  {explorer && (
                    <OpenTabIconButton
                      size="sm"
                      tooltipLabel={t<string>('captions.openOn', {
                        name: explorer.canonicalName,
                      })}
                      url={explorer.groupURL({
                        groupID: transaction.groupId,
                        ...(transaction.block && {
                          block: transaction.block,
                        }),
                      })}
                    />
                  )}
                </HStack>
              </PageItem>
            )}
          </VStack>
        </MoreInformationAccordion>
      </VStack>
    </>
  );
};

export default AssetTransferTransactionContent;
