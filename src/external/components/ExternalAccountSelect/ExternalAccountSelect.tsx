import {
  Button as ChakraButton,
  Icon,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronDownOutline } from 'react-icons/io5';

// components
import AccountItem from '@external/components/AccountItem';

// constants
import { DEFAULT_GAP } from '@common/constants';
import { EXTERNAL_INPUT_HEIGHT } from '@external/constants';

// hooks
import useBorderColor from '@common/hooks/useBorderColor';
import useButtonHoverBackgroundColor from '@common/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@common/hooks/useDefaultTextColor';
import usePrimaryColor from '@common/hooks/usePrimaryColor';
import usePrimaryRawColorCode from '@common/hooks/usePrimaryRawColorCode';
import useSubTextColor from '@common/hooks/useSubTextColor';

// modals
import ExternalAccountSelectModal from '@external/components/ExternalAccountSelectModal';

// types
import type { IExternalAccount } from '@common/types';
import type { IProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';

const ExternalAccountSelect: FC<IProps> = ({
  accounts,
  colorMode,
  fontFamily,
  onSelect,
  selectModalTitle,
  value,
}) => {
  const { t } = useTranslation();
  // hooks
  const borderColor = useBorderColor(colorMode);
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor(colorMode);
  const primaryColorCode = usePrimaryRawColorCode(colorMode);
  const defaultTextColor = useDefaultTextColor(colorMode);
  const primaryColor = usePrimaryColor(colorMode);
  const subTextColor = useSubTextColor(colorMode);
  const {
    isOpen: isAccountSelectModalOpen,
    onClose: onAccountSelectClose,
    onOpen: onAccountSelectModalOpen,
  } = useDisclosure();
  // handlers
  const handleOnClick = () => onAccountSelectModalOpen();
  const handleOnSelect = (_value: IExternalAccount) => onSelect(_value);

  return (
    <>
      {/*account select modal*/}
      <ExternalAccountSelectModal
        accounts={accounts}
        colorMode={colorMode}
        fontFamily={fontFamily}
        isOpen={isAccountSelectModalOpen}
        onClose={onAccountSelectClose}
        onSelect={handleOnSelect}
        title={selectModalTitle}
      />

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
        fontFamily={fontFamily}
        justifyContent="space-between"
        onClick={handleOnClick}
        px={DEFAULT_GAP - 2}
        py={1}
        rightIcon={
          <Icon
            as={IoChevronDownOutline}
            boxSize={calculateIconSize()}
            color={subTextColor}
          />
        }
        variant="ghost"
        w="full"
      >
        <Stack
          flexGrow={1}
          h={EXTERNAL_INPUT_HEIGHT}
          justifyContent="center"
          w="full"
        >
          {value ? (
            <AccountItem
              account={value}
              colorMode={colorMode}
              fontFamily={fontFamily}
            />
          ) : (
            <Text
              color={defaultTextColor}
              fontFamily={fontFamily}
              fontSize="xs"
              m={0}
              p={0}
              textAlign="left"
            >
              {t<string>('placeholders.selectAnAccount')}
            </Text>
          )}
        </Stack>
      </ChakraButton>
    </>
  );
};

export default ExternalAccountSelect;
