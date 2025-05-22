import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Center, HStack, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import React, { type FC, useCallback, useMemo } from 'react';
import { BsFolderMinus, BsFolderPlus } from 'react-icons/bs';
import { IoReorderTwoOutline } from 'react-icons/io5';

// components
import AccountAvatarWithBadges from '@provider/components/accounts/AccountAvatarWithBadges';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@common/constants';
import { SIDEBAR_ITEM_HEIGHT, SIDEBAR_MIN_WIDTH } from '@provider/constants';

// hooks
import useButtonHoverBackgroundColor from '@provider/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@provider/hooks/useColorModeValue';
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';
import useSubTextColor from '@provider/hooks/useSubTextColor';

// repositories
import AccountRepository from '@provider/repositories/AccountRepository';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@common/utils/ellipseAddress';

const SideBarAccountItem: FC<IProps> = ({
  account,
  accounts,
  active,
  colorMode,
  isShortForm,
  network,
  onAddToGroupClick,
  onClick,
  onRemoveFromGroupClick,
  systemInfo,
}) => {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: account.id,
  });
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  const activeBackground = useColorModeValue('gray.200', 'whiteAlpha.200');
  // memos
  const accountInformation = useMemo(
    () => AccountRepository.extractAccountInformationForNetwork(account, network),
    [account, network]
  );
  const activeProps = useMemo(
    () =>
      active
        ? {
            _hover: {
              bg: activeBackground,
            },
            bg: activeBackground,
          }
        : {
            _hover: {
              bg: buttonHoverBackgroundColor,
            },
            bg: BODY_BACKGROUND_COLOR,
          },
    [active, activeBackground, buttonHoverBackgroundColor]
  );
  const address = useMemo(() => convertPublicKeyToAVMAddress(account.publicKey), [account]);
  const enVoiName = useMemo(() => accountInformation?.enVoi.primaryName || null, [accountInformation]);
  // handlers
  const handleOnAddToGroupClick = () => onAddToGroupClick && onAddToGroupClick(account.id);
  const handleOnClick = () => onClick(account.id);
  const handleOnRemoveFromGroupClick = () =>
    account.groupID && onRemoveFromGroupClick && onRemoveFromGroupClick(account.id);
  // renders
  const renderNameAddress = useCallback(() => {
    if (account.name) {
      return (
        <VStack
          alignItems="flex-start"
          justifyContent="space-evenly"
          spacing={0}
          {...(isShortForm && {
            display: 'none',
          })}
        >
          <Text color={defaultTextColor} fontSize="sm" maxW={195} noOfLines={1} textAlign="left">
            {account.name}
          </Text>

          <Text color={subTextColor} fontSize="xs" textAlign="left">
            {enVoiName ?? ellipseAddress(address)}
          </Text>
        </VStack>
      );
    }

    // if there is no name, but there is an envoi, display the envoi
    if (enVoiName) {
      return (
        <VStack
          alignItems="flex-start"
          justifyContent="space-evenly"
          spacing={0}
          {...(isShortForm && {
            display: 'none',
          })}
        >
          <Text color={defaultTextColor} fontSize="sm" maxW={195} noOfLines={1} textAlign="left">
            {enVoiName}
          </Text>

          <Text color={subTextColor} fontSize="xs" textAlign="left">
            {ellipseAddress(address)}
          </Text>
        </VStack>
      );
    }

    return (
      <Text
        color={defaultTextColor}
        fontSize="sm"
        textAlign="left"
        {...(isShortForm && {
          display: 'none',
        })}
      >
        {ellipseAddress(address)}
      </Text>
    );
  }, [account, address, defaultTextColor, enVoiName, isShortForm, subTextColor]);

  return (
    <Tooltip aria-label="Name or address of the account" label={account.name || address}>
      <HStack
        {...activeProps}
        ref={setNodeRef}
        spacing={0}
        transform={CSS.Translate.toString({
          x: 0,
          y: transform?.y ?? 0,
          scaleX: transform?.scaleX ?? 1,
          scaleY: transform?.scaleY ?? 1,
        })}
        transition={transition}
        w="full"
        zIndex={isDragging ? 1 : 'auto'}
      >
        <Button
          _hover={{
            bg: 'none',
          }}
          bgColor="none"
          borderRadius={0}
          cursor="pointer"
          flexGrow={1}
          fontSize="md"
          justifyContent="start"
          minH={SIDEBAR_ITEM_HEIGHT}
          onClick={handleOnClick}
          p={0}
          variant="ghost"
        >
          {/*icon*/}
          <HStack m={0} p={0} spacing={DEFAULT_GAP / 3}>
            <Center minW={`${SIDEBAR_MIN_WIDTH}px`}>
              <AccountAvatarWithBadges
                account={account}
                accounts={accounts}
                colorMode={colorMode}
                network={network}
                systemInfo={systemInfo}
              />
            </Center>

            {/*name/envoi/address*/}
            {renderNameAddress()}
          </HStack>
        </Button>

        {/*add/remove group button*/}
        {account.groupID ? (
          <Button
            _hover={{
              bg: 'none',
            }}
            bgColor="none"
            borderRadius={0}
            cursor="pointer"
            minH={SIDEBAR_ITEM_HEIGHT}
            p={0}
            onClick={handleOnRemoveFromGroupClick}
            variant="ghost"
            {...(isShortForm && {
              display: 'none',
            })}
          >
            <Icon as={BsFolderMinus} boxSize={calculateIconSize()} color={subTextColor} />
          </Button>
        ) : (
          <Button
            _hover={{
              bg: 'none',
            }}
            bgColor="none"
            borderRadius={0}
            cursor="pointer"
            minH={SIDEBAR_ITEM_HEIGHT}
            p={0}
            onClick={handleOnAddToGroupClick}
            variant="ghost"
            {...(isShortForm && {
              display: 'none',
            })}
          >
            <Icon as={BsFolderPlus} boxSize={calculateIconSize()} color={subTextColor} />
          </Button>
        )}

        {/*re-order button*/}
        <Button
          _hover={{
            bg: 'none',
          }}
          bgColor="none"
          borderRadius={0}
          cursor="move"
          minH={SIDEBAR_ITEM_HEIGHT}
          p={0}
          variant="ghost"
          {...(isShortForm && {
            display: 'none',
          })}
          {...attributes}
          {...listeners}
        >
          <Icon as={IoReorderTwoOutline} boxSize={calculateIconSize()} color={subTextColor} />
        </Button>
      </HStack>
    </Tooltip>
  );
};

export default SideBarAccountItem;
