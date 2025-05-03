import { Center, Flex } from '@chakra-ui/react';
import React, { type FC } from 'react';

// components
import KibisisIcon from '@extension/components/icons/KibisisIcon';

// constants
import { BODY_BACKGROUND_COLOR } from '@common/constants';

// hooks
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';

const SplashPage: FC = () => {
  // hooks
  const primaryColor = usePrimaryColor();
  // misc
  const iconSize = calculateIconSize('xl');

  return (
    <Center as="main" backgroundColor={BODY_BACKGROUND_COLOR}>
      <Flex
        alignItems="center"
        direction="column"
        justifyContent="center"
        minH="100vh"
        w="full"
      >
        <KibisisIcon color={primaryColor} h={iconSize} w={iconSize} />
      </Flex>
    </Center>
  );
};

export default SplashPage;
