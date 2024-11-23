import {
  Button as ChakraButton,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { randomString } from '@stablelib/random';
import React, { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronForward } from 'react-icons/io5';

// components
import AccountAvatar from '@common/components/AccountAvatar';
import Button from '@common/components/Button';
import EmptyState from '@common/components/EmptyState';

// constants
import {
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  TAB_ITEM_HEIGHT,
} from '@common/constants';

// hooks
import useButtonHoverBackgroundColor from '@common/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@common/hooks/useDefaultTextColor';
import useSubTextColor from '@common/hooks/useSubTextColor';

// theme
import { theme } from '@common/theme';

// types
import type { IExternalAccount } from '@common/types';
import type { TProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@common/utils/ellipseAddress';

const ExternalAccountSelectModal: FC<TProps> = ({
  accounts,
  colorMode,
  fontFamily,
  isOpen,
  onClose,
  onSelect,
  title,
}) => {
  const { t } = useTranslation();
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor(colorMode);
  const defaultTextColor = useDefaultTextColor(colorMode);
  const subTextColor = useSubTextColor(colorMode);
  // memos
  const _context = useMemo(() => randomString(8), []);
  // misc
  const iconSize = calculateIconSize();
  // handlers
  const handleOnAccountSelect = (account: IExternalAccount) => () => {
    onSelect(account);
    handleClose();
  };
  const handleCancelClick = () => handleClose();
  const handleClose = () => onClose && onClose();
  // renders
  const renderContent = () => {
    if (accounts.length <= 0) {
      return (
        <>
          <Spacer />

          {/*empty state*/}
          <EmptyState
            colorMode={colorMode}
            fontFamily={fontFamily}
            text={t<string>('headings.noAccountsFound')}
          />

          <Spacer />
        </>
      );
    }

    return accounts.map((account, index) => {
      const address = convertPublicKeyToAVMAddress(account.publicKey);

      return (
        <ChakraButton
          _hover={{
            bg: BODY_BACKGROUND_COLOR,
          }}
          borderRadius="full"
          cursor="not-allowed"
          isDisabled={true}
          fontFamily={fontFamily}
          fontSize="sm"
          h={TAB_ITEM_HEIGHT}
          justifyContent="start"
          key={`${_context}-${index}`}
          px={DEFAULT_GAP / 2}
          py={0}
          sx={{
            opacity: 0.6,
          }}
          variant="ghost"
          w="full"
          {...(!account.watchAccount && {
            _hover: {
              bg: buttonHoverBackgroundColor,
            },
            cursor: 'pointer',
            isDisabled: false,
            onClick: handleOnAccountSelect(account),
            sx: {
              opacity: 1,
            },
            rightIcon: (
              <Icon
                as={IoChevronForward}
                color={defaultTextColor}
                h={iconSize}
                w={iconSize}
              />
            ),
          })}
        >
          <HStack py={DEFAULT_GAP - 2} spacing={DEFAULT_GAP - 2} w="full">
            {/*account icon*/}
            <AccountAvatar
              account={account}
              colorMode={colorMode}
              fontFamily={fontFamily}
            />

            {/*name/address*/}
            {account.name ? (
              <VStack
                alignItems="flex-start"
                flexGrow={1}
                justifyContent="space-evenly"
                spacing={0}
              >
                <Text
                  color={
                    !account.watchAccount ? defaultTextColor : subTextColor
                  }
                  fontFamily={fontFamily}
                  fontSize="sm"
                  maxW={400}
                  noOfLines={1}
                  m={0}
                  p={0}
                  textAlign="left"
                >
                  {account.name}
                </Text>

                <Text
                  color={subTextColor}
                  fontFamily={fontFamily}
                  fontSize="xs"
                  m={0}
                  p={0}
                  textAlign="left"
                >
                  {ellipseAddress(address, {
                    end: 10,
                    start: 10,
                  })}
                </Text>
              </VStack>
            ) : (
              <Text
                color={!account.watchAccount ? defaultTextColor : subTextColor}
                flexGrow={1}
                fontFamily={fontFamily}
                fontSize="sm"
                m={0}
                p={0}
                textAlign="left"
              >
                {ellipseAddress(address, {
                  end: 10,
                  start: 10,
                })}
              </Text>
            )}
          </HStack>
        </ChakraButton>
      );
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="lg"
      scrollBehavior="inside"
    >
      <ModalOverlay />

      <ModalContent
        alignSelf="flex-end"
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderRadius={theme.radii['3xl']}
        minH={0}
      >
        {/*heading*/}
        <ModalHeader
          display="flex"
          justifyContent="center"
          m={0}
          px={DEFAULT_GAP}
        >
          {/*heading*/}
          <Heading
            color={defaultTextColor}
            fontFamily={fontFamily}
            size="sm"
            m={0}
            p={0}
            textAlign="center"
            w="full"
          >
            {title || t<string>('headings.selectAccount')}
          </Heading>
        </ModalHeader>

        {/*body*/}
        <ModalBody m={0} px={DEFAULT_GAP}>
          <VStack spacing={1} w="full">
            {renderContent()}
          </VStack>
        </ModalBody>

        {/*footer*/}
        <ModalFooter m={0} p={DEFAULT_GAP}>
          <Button
            colorMode={colorMode}
            fontFamily={fontFamily}
            onClick={handleCancelClick}
            size="lg"
            variant="outline"
            w="full"
          >
            {t<string>('buttons.cancel')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExternalAccountSelectModal;
