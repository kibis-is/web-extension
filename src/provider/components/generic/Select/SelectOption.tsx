import { HStack, Icon, Text } from '@chakra-ui/react';
import React, { type FC, useMemo } from 'react';

// constants
import { DEFAULT_GAP } from '@common/constants';

// hooks
import useSubTextColor from '@provider/hooks/useSubTextColor';

// types
import type { ISelectOptionProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';

const SelectOption: FC<ISelectOptionProps> = ({ color, fontSize = 'md', value }) => {
  // hooks
  const subTextColor = useSubTextColor();
  // memos
  const textColor = useMemo(() => color || subTextColor, [color, subTextColor]);

  return (
    <HStack align="center" justify="flex-start" spacing={DEFAULT_GAP - 2}>
      {/*icon*/}
      {value.icon && <Icon as={value.icon} boxSize={calculateIconSize()} color={textColor} />}

      {/*label*/}
      <Text
        color={textColor}
        fontSize={fontSize}
        sx={{
          display: 'inline-block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value.label}
      </Text>
    </HStack>
  );
};

export default SelectOption;
