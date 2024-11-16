import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Avatar,
  Button,
  Center,
  Collapse,
  HStack,
  Icon,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import React, { type FC } from 'react';
import {
  IoFolderOutline,
  IoFolderOpenOutline,
  IoReorderTwoOutline,
} from 'react-icons/io5';

// constants
import {
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  SIDEBAR_ITEM_HEIGHT,
  SIDEBAR_MIN_WIDTH,
} from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const SideBarGroupItem: FC<IProps> = ({
  activeAccountID,
  accounts,
  children,
  group,
  isShortForm,
}) => {
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen:
      !!activeAccountID &&
      !!accounts
        .filter(({ groupID }) => groupID === group.id)
        .find(({ id }) => id === activeAccountID),
  });
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: group.id,
  });
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  const iconBackground = useColorModeValue('gray.300', 'whiteAlpha.400');
  // handlers
  const handleOnClick = () => onToggle();

  return (
    <>
      <Tooltip label={group.name}>
        <HStack
          _hover={{
            bg: buttonHoverBackgroundColor,
          }}
          bg={BODY_BACKGROUND_COLOR}
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
            <HStack m={0} p={0} spacing={DEFAULT_GAP / 3} w="full">
              {/*icon*/}
              <Center minW={`${SIDEBAR_MIN_WIDTH}px`}>
                <Avatar
                  bg={iconBackground}
                  icon={
                    <Icon
                      as={isOpen ? IoFolderOpenOutline : IoFolderOutline}
                      boxSize={calculateIconSize()}
                      color={defaultTextColor}
                    />
                  }
                  size="sm"
                />
              </Center>

              {/*name*/}
              <Text
                color={defaultTextColor}
                fontSize="sm"
                textAlign="left"
                {...(isShortForm && {
                  display: 'none',
                })}
              >
                {group.name}
              </Text>
            </HStack>
          </Button>

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
            <Icon
              as={IoReorderTwoOutline}
              boxSize={calculateIconSize()}
              color={subTextColor}
            />
          </Button>
        </HStack>
      </Tooltip>

      {/*accounts*/}
      <Collapse in={isOpen} animateOpacity={true}>
        <>{children}</>
      </Collapse>
    </>
  );
};

export default SideBarGroupItem;
