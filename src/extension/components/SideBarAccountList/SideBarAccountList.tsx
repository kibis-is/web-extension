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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React, { type FC, useEffect, useState } from 'react';

// components
import GroupItem from './GroupItem';
import Item from './Item';
import SkeletonItem from './SkeletonItem';

// enums
import { DelimiterEnum } from '@extension/enums';

// types
import type {
  IAccountGroup,
  IAccountWithExtendedProps,
} from '@extension/types';
import type { IProps } from './types';

const SideBarAccountList: FC<IProps> = ({
  accounts,
  activeAccount,
  isLoading,
  isShortForm,
  items,
  network,
  onClick,
  onSort,
  systemInfo,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // states
  const [_items, setItems] =
    useState<(IAccountWithExtendedProps | IAccountGroup)[]>(items);
  // handlers
  const handleOnClick = async (id: string) => onClick(id);
  const handleOnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    let previousIndex: number;
    let nextIndex: number;
    let updatedItems: (IAccountWithExtendedProps | IAccountGroup)[];

    if (active.id !== over?.id) {
      previousIndex = items.findIndex(({ id }) => id === active.id);
      nextIndex = items.findIndex(({ id }) => id === over?.id);

      setItems((prevState) => {
        updatedItems = arrayMove(prevState, previousIndex, nextIndex);

        // update the external account/group state
        onSort(updatedItems);

        return updatedItems;
      });
    }
  };

  // update the internal accounts/groups state with the incoming state
  useEffect(() => setItems(items), [items]);

  return (
    <>
      {isLoading || !network ? (
        Array.from({ length: 3 }, (_, index) => (
          <SkeletonItem key={`sidebar-fetching-item-${index}`} />
        ))
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleOnDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {_items.map((value) => {
              if (value._delimiter === DelimiterEnum.Account) {
                return (
                  <Item
                    account={value}
                    accounts={accounts}
                    active={
                      activeAccount ? value.id === activeAccount.id : false
                    }
                    isShortForm={isShortForm}
                    key={value.id}
                    network={network}
                    onClick={handleOnClick}
                    systemInfo={systemInfo}
                  />
                );
              }

              return (
                <GroupItem
                  group={value}
                  isShortForm={isShortForm}
                  key={value.id}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      )}
    </>
  );
};

export default SideBarAccountList;
