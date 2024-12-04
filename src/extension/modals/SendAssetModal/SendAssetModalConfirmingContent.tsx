import { Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoSwapVerticalOutline } from 'react-icons/io5';

// components
import CircularProgressWithIcon from '@common/components/CircularProgressWithIcon';

// constants
import { DEFAULT_GAP } from '@common/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// types
import type { ISendAssetModalConfirmingContentProps } from './types';

const SendAssetModalConfirmingContent: FC<
  ISendAssetModalConfirmingContentProps
> = ({ colorMode, numberOfTransactions }) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();

  return (
    <VStack
      alignItems="center"
      flexGrow={1}
      justifyContent="center"
      spacing={DEFAULT_GAP - 2}
      w="full"
    >
      {/*progress*/}
      <CircularProgressWithIcon
        colorMode={colorMode}
        icon={IoSwapVerticalOutline}
      />

      {/*captions*/}
      <Text color={defaultTextColor} fontSize="md" textAlign="center" w="full">
        {numberOfTransactions
          ? t<string>('captions.confirmingTransactionWithAmount', {
              number: numberOfTransactions,
            })
          : t<string>('captions.confirmingTransaction')}
      </Text>
    </VStack>
  );
};

export default SendAssetModalConfirmingContent;
