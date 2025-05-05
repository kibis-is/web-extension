import { Text, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCubeOutline } from 'react-icons/io5';

// components
import CircularProgressWithIcon from '@common/components/CircularProgressWithIcon';

// constants
import { DEFAULT_GAP } from '@common/constants';

// enums
import { AssetTypeEnum } from '@provider/enums';

// hooks
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';

// types
import type { IAddAssetsConfirmingModalContentProps } from './types';

const AddAssetsConfirmingModalContent: FC<IAddAssetsConfirmingModalContentProps> = ({ asset, colorMode }) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  // misc
  let message: string | null = null;

  switch (asset.type) {
    case AssetTypeEnum.ARC0200:
      message = t<string>('captions.addAssetConfirming', {
        context: asset.type,
        symbol: asset.symbol,
      });
      break;
    case AssetTypeEnum.Standard:
      message = t<string>('captions.addAssetConfirming', {
        context: asset.type,
        symbol: asset.unitName || asset.name || asset.id,
      });
      break;
    default:
      break;
  }

  return (
    <VStack
      alignItems="center"
      flexGrow={1}
      justifyContent="center"
      px={DEFAULT_GAP}
      spacing={DEFAULT_GAP / 2}
      w="full"
    >
      {/*progress*/}
      <CircularProgressWithIcon colorMode={colorMode} icon={IoCubeOutline} />

      {/*message*/}
      {message && (
        <Text color={defaultTextColor} fontSize="sm" textAlign="center" w="full">
          {message}
        </Text>
      )}
    </VStack>
  );
};

export default AddAssetsConfirmingModalContent;
