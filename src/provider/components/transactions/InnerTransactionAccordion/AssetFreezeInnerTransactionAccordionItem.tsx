import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Code,
  HStack,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@provider/components/accounts/AddressDisplay';
import CopyIconButton from '@provider/components/generic/CopyIconButton';
import OpenTabIconButton from '@provider/components/generic/OpenTabIconButton';
import PageItem from '@provider/components/pages/PageItem';

// enums
import { TransactionTypeEnum } from '@provider/enums';

// hooks
import useStandardAssetById from '@provider/hooks/useStandardAssetById';
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';
import useSubTextColor from '@provider/hooks/useSubTextColor';

// selectors
import { useSelectSettingsPreferredBlockExplorer } from '@provider/selectors';

// types
import type { IAssetFreezeTransaction, IAssetUnfreezeTransaction } from '@provider/types';
import type { IItemProps } from './types';

// utils
import isAccountKnown from '@provider/utils/isAccountKnown';

const AssetFreezeInnerTransactionAccordionItem: FC<IItemProps<IAssetFreezeTransaction | IAssetUnfreezeTransaction>> = ({
  accounts,
  color,
  fontSize,
  minButtonHeight,
  network,
  transaction,
}) => {
  const { t } = useTranslation();
  // selectors
  const preferredExplorer = useSelectSettingsPreferredBlockExplorer();
  // hooks
  const { standardAsset, updating } = useStandardAssetById(transaction.assetId);
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  // misc
  const explorer =
    network.blockExplorers.find((value) => value.id === preferredExplorer?.id) || network.blockExplorers[0] || null; // get the preferred explorer, if it exists in the networks, otherwise get the default one

  return (
    <AccordionItem border="none" px={3} py={2} w="full">
      <AccordionButton minH={minButtonHeight} p={0}>
        {/*type*/}
        <Text color={color || defaultTextColor} fontSize={fontSize}>
          {t<string>('headings.transaction', { context: transaction.type })}
        </Text>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={0} pt={2} px={0}>
        <VStack spacing={2} w="full">
          {/*asset id*/}
          <PageItem fontSize="xs" label={t<string>('labels.assetId')}>
            {!standardAsset || updating ? (
              <Skeleton>
                <Text color={subTextColor} fontSize="xs">
                  12345678
                </Text>
              </Skeleton>
            ) : (
              <HStack spacing={0}>
                <Text color={subTextColor} fontSize="xs">
                  {standardAsset.id}
                </Text>
                <CopyIconButton
                  ariaLabel={t<string>('labels.copyAssetId')}
                  tooltipLabel={t<string>('labels.copyAssetId')}
                  size="xs"
                  value={standardAsset.id}
                />
                {explorer && (
                  <OpenTabIconButton
                    size="xs"
                    tooltipLabel={t<string>('captions.openOn', {
                      name: explorer.canonicalName,
                    })}
                    url={explorer.assetURL(standardAsset.id)}
                  />
                )}
              </HStack>
            )}
          </PageItem>

          {/*frozen address*/}
          <PageItem
            fontSize="xs"
            label={t<string>(
              transaction.type === TransactionTypeEnum.AssetFreeze
                ? 'labels.accountToFreeze'
                : 'labels.accountToUnfreeze'
            )}
          >
            <HStack spacing={0}>
              <AddressDisplay
                accounts={accounts}
                address={transaction.frozenAddress}
                ariaLabel="Address to freeze/unfreeze"
                size="xs"
                network={network}
              />

              {/*open in explorer button*/}
              {!isAccountKnown(accounts, transaction.frozenAddress) && explorer && (
                <OpenTabIconButton
                  size="xs"
                  tooltipLabel={t<string>('captions.openOn', {
                    name: explorer.canonicalName,
                  })}
                  url={explorer.accountURL(transaction.frozenAddress)}
                />
              )}
            </HStack>
          </PageItem>

          {/*note*/}
          {transaction.note && (
            <PageItem fontSize="xs" label={t<string>('labels.note')}>
              <Code borderRadius="md" color={defaultTextColor} fontSize="xs" wordBreak="break-word">
                {transaction.note}
              </Code>
            </PageItem>
          )}
        </VStack>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default AssetFreezeInnerTransactionAccordionItem;
