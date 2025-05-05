import { HStack, Skeleton, Text } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@provider/components/AddressDisplay';
import CopyIconButton from '@provider/components/CopyIconButton';
import OpenTabIconButton from '@provider/components/OpenTabIconButton';

// constants
import { DEFAULT_GAP, MODAL_ITEM_HEIGHT } from '@common/constants';

// hooks
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';
import useSubTextColor from '@provider/hooks/useSubTextColor';

// types
import type { IProps } from './types';

const ModalAccountItem: FC<IProps> = ({
  accounts,
  address,
  explorer = null,
  isLoading = false,
  label,
  network,
  showCopyButton = false,
  ...stackProps
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // memos
  const loadingText = useMemo(() => faker.random.alphaNumeric(12), []);

  return (
    <HStack
      align="center"
      justify="space-between"
      minH={MODAL_ITEM_HEIGHT}
      spacing={DEFAULT_GAP / 3}
      w="full"
      {...stackProps}
    >
      {/*label*/}
      <Text color={defaultTextColor} fontSize="xs" w="full">
        {label}
      </Text>

      {isLoading ? (
        <Skeleton>
          <Text color={subTextColor} fontSize="xs">
            {loadingText}
          </Text>
        </Skeleton>
      ) : (
        <HStack justify="flex-end" spacing={1} w="full">
          <AddressDisplay
            accounts={accounts}
            address={address}
            ariaLabel={t<string>('ariaLabels.walletIcon')}
            size="sm"
            network={network}
          />

          {/*copy button*/}
          {showCopyButton && (
            <CopyIconButton
              ariaLabel={t<string>('labels.copyAddress')}
              tooltipLabel={t<string>('labels.copyAddress')}
              value={address}
            />
          )}

          {/*open in explorer*/}
          {explorer && (
            <OpenTabIconButton
              tooltipLabel={t<string>('captions.openOn', {
                name: explorer.canonicalName,
              })}
              url={explorer.accountURL(address)}
            />
          )}
        </HStack>
      )}
    </HStack>
  );
};

export default ModalAccountItem;
