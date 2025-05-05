import { Text, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineCallReceived } from 'react-icons/md';

// components
import CircularProgressWithIcon from '@common/components/CircularProgressWithIcon';

// constants
import { DEFAULT_GAP } from '@common/constants';

// hooks
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';
import useSubTextColor from '@provider/hooks/useSubTextColor';

// types
import type { IBaseComponentProps } from '@common/types';

const AddCustomNodeLoadingModalContent: FC<IBaseComponentProps> = ({ colorMode }) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();

  return (
    <VStack alignItems="center" flexGrow={1} justifyContent="center" spacing={DEFAULT_GAP - 2} w="full">
      {/*progress*/}
      <CircularProgressWithIcon colorMode={colorMode} icon={MdOutlineCallReceived} iconColor={defaultTextColor} />

      {/*caption*/}
      <Text color={subTextColor} fontSize="sm" textAlign="center" w="full">
        {t<string>('captions.fetchingNetworkDetails')}
      </Text>
    </VStack>
  );
};

export default AddCustomNodeLoadingModalContent;
