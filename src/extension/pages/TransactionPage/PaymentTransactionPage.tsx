import {
  Code,
  HStack,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetDisplay from '@extension/components/AssetDisplay';
import CopyIconButton from '@extension/components/CopyIconButton';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import PageHeader from '@extension/components/PageHeader';
import PageItem from '@extension/components/PageItem';

// constants
import { DEFAULT_GAP } from '@common/constants';
import { PAGE_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectSettingsColorMode,
  useSelectSettingsPreferredBlockExplorer,
} from '@extension/selectors';

// types
import type { IPaymentTransaction } from '@extension/types';
import type { IProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import ellipseAddress from '@common/utils/ellipseAddress';

const PaymentTransactionPage: FC<IProps<IPaymentTransaction>> = ({
  account,
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
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // misc
  const accountAddress = convertPublicKeyToAVMAddress(account.publicKey);
  const amount: BigNumber = new BigNumber(transaction.amount);
  const explorer =
    network.blockExplorers.find(
      (value) => value.id === preferredExplorer?.id
    ) ||
    network.blockExplorers[0] ||
    null; // get the preferred explorer, if it exists in the networks, otherwise get the default one
  const isReceiverKnown =
    accounts.findIndex(
      (value) =>
        convertPublicKeyToAVMAddress(value.publicKey) === transaction.receiver
    ) > -1;
  const isSenderKnown =
    accounts.findIndex(
      (value) =>
        convertPublicKeyToAVMAddress(value.publicKey) === transaction.sender
    ) > -1;
  // handlers
  const handleMoreInformationToggle = (value: boolean) =>
    value ? onOpen() : onClose();

  return (
    <>
      <PageHeader
        colorMode={colorMode}
        title={t<string>('headings.transaction', { context: transaction.type })}
      />

      <VStack
        alignItems="flex-start"
        justifyContent="flex-start"
        px={DEFAULT_GAP}
        spacing={4}
        w="full"
      >
        {/*amount*/}
        <PageItem fontSize="sm" label={t<string>('labels.amount')}>
          <AssetDisplay
            atomicUnitAmount={amount}
            amountColor={
              amount.lte(0)
                ? defaultTextColor
                : transaction.receiver === accountAddress
                ? 'green.500'
                : 'red.500'
            }
            decimals={network.nativeCurrency.decimals}
            fontSize="sm"
            icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
              color: subTextColor,
              h: 3,
              w: 3,
            })}
            prefix={
              amount.lte(0)
                ? undefined
                : transaction.receiver === accountAddress
                ? '+'
                : '-'
            }
            unit={network.nativeCurrency.symbol}
          />
        </PageItem>

        {/*from*/}
        <PageItem fontSize="sm" label={t<string>('labels.from')}>
          <HStack spacing={0}>
            <AddressDisplay
              accounts={accounts}
              address={transaction.sender}
              ariaLabel="From address"
              size="sm"
              network={network}
            />

            {/*open in explorer button*/}
            {!isSenderKnown && explorer && (
              <OpenTabIconButton
                size="sm"
                tooltipLabel={t<string>('captions.openOn', {
                  name: explorer.canonicalName,
                })}
                url={explorer.accountURL(transaction.sender)}
              />
            )}
          </HStack>
        </PageItem>

        {/*to*/}
        <PageItem fontSize="sm" label={t<string>('labels.to')}>
          <HStack spacing={0}>
            <AddressDisplay
              accounts={accounts}
              address={transaction.receiver}
              ariaLabel="From address"
              size="sm"
              network={network}
            />

            {/*open in explorer button*/}
            {!isReceiverKnown && explorer && (
              <OpenTabIconButton
                size="sm"
                tooltipLabel={t<string>('captions.openOn', {
                  name: explorer.canonicalName,
                })}
                url={explorer.accountURL(transaction.receiver)}
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
            <Code
              borderRadius="md"
              color={defaultTextColor}
              fontSize="sm"
              wordBreak="break-word"
            >
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
                  <Tooltip
                    aria-label="The ID of the transaction"
                    label={transaction.id}
                  >
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
                  <Tooltip
                    aria-label="The group ID of the transaction"
                    label={transaction.groupId}
                  >
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

export default PaymentTransactionPage;
