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
import SideBarGroupItem from '@extension/components/SideBarGroupItem';

// types
import type { IAccountGroup } from '@extension/types';
import type { IProps } from './types';

// utils
import sortByIndex from '@extension/utils/sortByIndex';

const SideBarGroupList: FC<IProps> = ({
  accounts,
  activeAccountID,
  colorMode,
  groups,
  isShortForm,
  network,
  onAccountClick,
  onAccountSort,
  onGroupSort,
  onRemoveAccountFromGroupClick,
  systemInfo,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // memos
  const sortedGroups = useMemo(() => sortByIndex([...groups]), [groups]);
  // states
  const [_groups, setGroups] = useState<IAccountGroup[]>(sortedGroups); // a local state fixes the delay between the ui and redux updates
  // handlers
  const handleOnAccountClick = async (id: string) => onAccountClick(id);
  const handleOnGroupDragEnd = (event: DragEndEvent) => {
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
      updatedItems = arrayMove(prevState, previousIndex, nextIndex).map(
        (value, index) => ({
          ...value,
          index,
        })
      );

      // update the external state
      onGroupSort(updatedItems);

      return updatedItems;
    });
  };

  useEffect(() => setGroups(sortedGroups), [sortedGroups]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleOnGroupDragEnd}
    >
      <SortableContext items={_groups} strategy={verticalListSortingStrategy}>
        {_groups.map((group) => (
          <SideBarGroupItem
            activeAccountID={activeAccountID}
            accounts={accounts}
            colorMode={colorMode}
            group={group}
            isShortForm={isShortForm}
            key={group.id}
            network={network}
            onAccountClick={handleOnAccountClick}
            onAccountSort={onAccountSort}
            onRemoveAccountFromGroupClick={onRemoveAccountFromGroupClick}
            systemInfo={systemInfo}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default SideBarGroupList;
