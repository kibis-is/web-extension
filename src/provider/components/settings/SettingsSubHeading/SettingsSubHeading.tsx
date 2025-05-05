import { Text } from '@chakra-ui/react';
import React, { FC } from 'react';

// constants
import { DEFAULT_GAP } from '@common/constants';

// hooks
import useSubTextColor from '@provider/hooks/useSubTextColor';

interface IProps {
  color?: string;
  text: string;
}
const SettingsSubHeading: FC<IProps> = ({ color, text }: IProps) => {
  const subTextColor: string = useSubTextColor();

  return (
    <Text
      as="b"
      color={color || subTextColor}
      fontSize="md"
      pb={DEFAULT_GAP / 3}
      px={DEFAULT_GAP - 2}
      textAlign="left"
      w="full"
    >
      {text}
    </Text>
  );
};

export default SettingsSubHeading;
