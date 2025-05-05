import { Button as ChakraButton, Icon, Stack, useDisclosure, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronDownOutline } from 'react-icons/io5';

// components
import AssetItem from '@provider/components/AssetItem';
import Label from '@common/components/Label';

// constants
import { DEFAULT_GAP, INPUT_HEIGHT } from '@common/constants';

// hooks
import useBorderColor from '@provider/hooks/useBorderColor';
import useButtonHoverBackgroundColor from '@provider/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@provider/hooks/useColorModeValue';
import usePrimaryColor from '@provider/hooks/usePrimaryColor';
import useSubTextColor from '@provider/hooks/useSubTextColor';

// modals
import AssetSelectModal from './AssetSelectModal';

// theme
import { theme } from '@common/theme';

// types
import type { IAssetTypes, INativeCurrency } from '@provider/types';
import type { IProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';

const AssetSelect: FC<IProps> = ({ assets, colorMode, label, network, onSelect, required = false, value }) => {
  const { t } = useTranslation();
  // hooks
  const borderColor = useBorderColor();
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const primaryColorCode = useColorModeValue(theme.colors.primaryLight['500'], theme.colors.primaryDark['500']);
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  const {
    isOpen: isAssetSelectModalOpen,
    onClose: onAssetSelectClose,
    onOpen: onAssetSelectModalOpen,
  } = useDisclosure();
  // handlers
  const handleOnClick = () => onAssetSelectModalOpen();
  const handleOnSelect = (_value: (IAssetTypes | INativeCurrency)[]) => onSelect(_value[0]);

  return (
    <>
      {/*asset select modal*/}
      <AssetSelectModal
        assets={assets}
        colorMode={colorMode}
        isOpen={isAssetSelectModalOpen}
        multiple={false}
        onClose={onAssetSelectClose}
        onSelect={handleOnSelect}
      />

      <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
        {/*label*/}
        {label && <Label colorMode={colorMode} label={label} px={DEFAULT_GAP - 2} required={required} />}

        <ChakraButton
          _focus={{
            borderColor: primaryColor,
            boxShadow: `0 0 0 1px ${primaryColorCode}`,
          }}
          _hover={{
            bg: buttonHoverBackgroundColor,
            borderColor: borderColor,
          }}
          aria-label={t<string>('labels.selectAsset')}
          alignItems="center"
          borderStyle="solid"
          borderWidth="1px"
          borderRadius="full"
          h={INPUT_HEIGHT}
          justifyContent="space-between"
          onClick={handleOnClick}
          px={DEFAULT_GAP - 2}
          py={0}
          rightIcon={<Icon as={IoChevronDownOutline} boxSize={calculateIconSize()} color={subTextColor} />}
          variant="ghost"
          w="full"
        >
          <Stack flexGrow={1} justifyContent="center" w="full">
            <AssetItem asset={value} network={network} />
          </Stack>
        </ChakraButton>
      </VStack>
    </>
  );
};

export default AssetSelect;
