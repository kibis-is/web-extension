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
import SideBarAccountItem from '@extension/components/SideBarAccountItem';
import SideBarGroupItem from '@extension/components/SideBarGroupItem';

// types
import type { IAccountGroup } from '@extension/types';
import type { IProps } from './types';

const SideBarGroupList: FC<IProps> = ({
  accounts,
  activeAccount,
  groups,
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
  // states
  const [_groups, setGroups] = useState<IAccountGroup[]>(groups);
  // handlers
  const handleOnAccountClick = async (id: string) => onAccountClick(id);
  const handleOnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    let previousIndex: number;
    let nextIndex: number;
    let updatedItems: IAccountGroup[];

    if (!over || active.id === over.id) {
      return;
    }

    previousIndex = _groups.findIndex(({ id }) => id === active.id);
    nextIndex = _groups.findIndex(({ id }) => id === over.id);

    setGroups((prevState) => {
      updatedItems = arrayMove(prevState, previousIndex, nextIndex);

      // update the external state
      onSort(updatedItems);

      return updatedItems;
    });
  };

  useEffect(() => setGroups(groups), [groups]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleOnDragEnd}
    >
      <SortableContext items={groups} strategy={verticalListSortingStrategy}>
        {groups.map((group) => (
          <SideBarGroupItem
            activeAccountID={activeAccount?.id || null}
            accounts={accounts}
            group={group}
            isShortForm={isShortForm}
            key={group.id}
            network={network}
            onAccountClick={handleOnAccountClick}
            systemInfo={systemInfo}
          >
            {accounts
              .filter(({ groupID }) => !!groupID && groupID === group.id)
              .map((value) => (
                <SideBarAccountItem
                  account={value}
                  accounts={accounts}
                  active={
                    activeAccount?.id ? value.id === activeAccount.id : false
                  }
                  isShortForm={isShortForm}
                  key={value.id}
                  network={network}
                  onClick={onAccountClick}
                  systemInfo={systemInfo}
                />
              ))}
          </SideBarGroupItem>
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default SideBarGroupList;
