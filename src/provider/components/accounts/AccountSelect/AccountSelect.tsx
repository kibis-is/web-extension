import { Button as ChakraButton, Icon, Stack, Text, useDisclosure, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronDownOutline } from 'react-icons/io5';

// components
import AccountItem from '@provider/components/accounts/AccountItem';
import Label from '@common/components/Label';

// constants
import { DEFAULT_GAP, INPUT_HEIGHT } from '@common/constants';

// hooks
import useBorderColor from '@provider/hooks/useBorderColor';
import useButtonHoverBackgroundColor from '@provider/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@provider/hooks/useColorModeValue';
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';
import usePrimaryColor from '@provider/hooks/usePrimaryColor';
import useSubTextColor from '@provider/hooks/useSubTextColor';

// modals
import AccountSelectModal from './AccountSelectModal';

// theme
import { theme } from '@common/theme';

// types
import type { IAccountWithExtendedProps } from '@provider/types';
import type { TProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';

const AccountSelect: FC<TProps> = ({
  accounts,
  allowWatchAccounts,
  colorMode,
  label,
  network,
  onSelect,
  required = false,
  selectModalTitle,
  systemInfo,
  value,
}) => {
  const { t } = useTranslation();
  // hooks
  const borderColor = useBorderColor();
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const primaryColorCode = useColorModeValue(theme.colors.primaryLight['500'], theme.colors.primaryDark['500']);
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  const {
    isOpen: isAccountSelectModalOpen,
    onClose: onAccountSelectClose,
    onOpen: onAccountSelectModalOpen,
  } = useDisclosure();
  // handlers
  const handleOnClick = () => onAccountSelectModalOpen();
  const handleOnSelect = (_value: IAccountWithExtendedProps[]) => onSelect(_value[0]);

  return (
    <>
      {/*account select modal*/}
      <AccountSelectModal
        accounts={accounts}
        allowWatchAccounts={allowWatchAccounts}
        colorMode={colorMode}
        isOpen={isAccountSelectModalOpen}
        multiple={false}
        network={network}
        onClose={onAccountSelectClose}
        onSelect={handleOnSelect}
        systemInfo={systemInfo}
        title={selectModalTitle}
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
          aria-label={t<string>('labels.selectAccount')}
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
            {value ? (
              <AccountItem account={value} colorMode={colorMode} network={network} />
            ) : (
              <Text color={defaultTextColor} flexGrow={1} fontSize="sm" textAlign="left">
                {t<string>('placeholders.selectAnAccount')}
              </Text>
            )}
          </Stack>
        </ChakraButton>
      </VStack>
    </>
  );
};

export default AccountSelect;
