import {
  CircularProgress,
  CircularProgressLabel,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { FC } from 'react';

// hooks
import usePrimaryColor from '@common/hooks/usePrimaryColor';
import useSubTextColor from '@common/hooks/useSubTextColor';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';

const CircularProgressWithIcon: FC<IProps> = ({
  colorMode,
  icon,
  iconColor,
  progress,
  progressColor,
}) => {
  // hooks
  const primaryColor = usePrimaryColor(colorMode);
  const subTextColor = useSubTextColor(colorMode);
  const trackColor = useColorModeValue('gray.300', 'whiteAlpha.400');
  // misc
  const iconSize = calculateIconSize('lg');

  return (
    <CircularProgress
      color={progressColor || primaryColor}
      isIndeterminate={!progress}
      size="100px"
      thickness="4px"
      trackColor={trackColor}
      {...(progress && {
        value: progress[1] > 0 ? (progress[0] / progress[1]) * 100 : 0,
      })}
    >
      <CircularProgressLabel
        alignItems="center"
        display="flex"
        justifyContent="center"
      >
        <Icon
          as={icon}
          color={iconColor || subTextColor}
          h={iconSize}
          w={iconSize}
        />
      </CircularProgressLabel>
    </CircularProgress>
  );
};

export default CircularProgressWithIcon;
