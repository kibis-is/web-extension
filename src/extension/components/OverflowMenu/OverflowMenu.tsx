import { Icon, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { randomString } from '@stablelib/random';
import React, { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IoEllipsisVerticalOutline } from 'react-icons/io5';

// components
import IconButton from '@common/components/IconButton';

// constants
import { DEFAULT_GAP } from '@common/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';

const OverflowMenu: FC<IProps> = ({ items }) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  // memos
  const _context = useMemo(() => randomString(8), []);

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label={t<string>('ariaLabels.ellipsisIcon')}
        icon={IoEllipsisVerticalOutline}
        variant="ghost"
      />

      <MenuList>
        {items.map(({ icon, label, onSelect }, index) => (
          <MenuItem
            color={defaultTextColor}
            fontSize="sm"
            key={`${_context}-${index}`}
            minH={DEFAULT_GAP * 2}
            onClick={onSelect}
            {...(icon && {
              icon: (
                <Icon
                  as={icon}
                  boxSize={calculateIconSize()}
                  color={defaultTextColor}
                />
              ),
            })}
          >
            {label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default OverflowMenu;
