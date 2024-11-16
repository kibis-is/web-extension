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
import React, { type FC, useEffect, useMemo, useState } from 'react';

// components
import SideBarAccountItem from '@extension/components/SideBarAccountItem';

// types
import type { IAccountWithExtendedProps } from '@extension/types';
import type { IProps } from './types';

// utils
import sortByIndex from '@extension/utils/sortByIndex';

const SideBarAccountList: FC<IProps> = ({
  accounts,
  activeAccountID,
  isShortForm,
  network,
  onAccountClick,
  onSort,
  systemInfo,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // memos
  const accountsWithoutGroup = useMemo(
    () => sortByIndex(accounts.filter(({ groupID }) => !groupID)),
    [accounts]
  );
  // states
  const [_accounts, setAccounts] =
    useState<IAccountWithExtendedProps[]>(accountsWithoutGroup); // a local state fixes the delay between the ui and redux updates
  // handlers
  const handleOnAccountClick = async (id: string) => onAccountClick(id);
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
          index,
        })
      );

      // update the external state
      onSort(updatedItems);

      return updatedItems;
    });
  };

  useEffect(() => setAccounts(accountsWithoutGroup), [accountsWithoutGroup]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleOnDragEnd}
    >
      <SortableContext
        items={accountsWithoutGroup}
        strategy={verticalListSortingStrategy}
      >
        {accountsWithoutGroup.map((value) => (
          <SideBarAccountItem
            account={value}
            accounts={accounts}
            active={activeAccountID ? value.id === activeAccountID : false}
            isShortForm={isShortForm}
            key={value.id}
            network={network}
            onClick={handleOnAccountClick}
            systemInfo={systemInfo}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default SideBarAccountList;
