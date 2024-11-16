import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
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
import React, { type FC, useMemo, useState } from 'react';
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

// components
import SideBarAccountItem from '@extension/components/SideBarAccountItem';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// types
import type { IAccountWithExtendedProps } from '@extension/types';
import type { IProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const SideBarGroupItem: FC<IProps> = ({
  activeAccountID,
  accounts,
  group,
  isShortForm,
  network,
  onAccountClick,
  onAccountSort,
  systemInfo,
}) => {
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen:
      !!activeAccountID &&
      !!accounts
        .filter(({ groupID }) => groupID === group.id)
        .find(({ id }) => id === activeAccountID),
  });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
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
  // memos
  const groupAccounts = useMemo(
    () =>
      AccountRepository.sortByGroupIndex(
        accounts.filter(({ groupID }) => !!groupID && groupID === group.id)
      ),
    [accounts]
  );
  // states
  const [_accounts, setAccounts] =
    useState<IAccountWithExtendedProps[]>(groupAccounts); // a local state fixes the delay between the ui and redux updates
  // handlers
  const handleOnClick = () => onToggle();
  const handleOnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    let previousIndex: number;
    let nextIndex: number;
    let updatedItems: IAccountWithExtendedProps[];

    if (!over || active.id === over.id) {
      return;
    }

    previousIndex = _accounts.findIndex(({ id }) => id === active.id);
    nextIndex = _accounts.findIndex(({ id }) => id === over.id);

    setAccounts((prevState) => {
      updatedItems = arrayMove(prevState, previousIndex, nextIndex).map(
        (value, index) => ({
          ...value,
          groupIndex: index,
        })
      );

      // update the external state
      onAccountSort(updatedItems);

      return updatedItems;
    });
  };

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleOnDragEnd}
        >
          <SortableContext
            items={_accounts}
            strategy={verticalListSortingStrategy}
          >
            {_accounts.map((value) => (
              <SideBarAccountItem
                account={value}
                accounts={accounts}
                active={activeAccountID ? value.id === activeAccountID : false}
                isShortForm={isShortForm}
                key={value.id}
                network={network}
                onClick={onAccountClick}
                systemInfo={systemInfo}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Collapse>
    </>
  );
};

export default SideBarGroupItem;
