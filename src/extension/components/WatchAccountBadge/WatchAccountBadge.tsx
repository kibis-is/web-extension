import { Tag, TagLabel, TagLeftIcon, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoEyeOutline } from 'react-icons/io5';

// selectors
import { useSelectSettingsColorMode } from '@extension/selectors';

// types
import type { IProps } from './types';

const WatchAccountBadge: FC<IProps> = ({ size = 'sm', tooltipLabel }) => {
  const { t } = useTranslation();
  // selectors
  const colorMode = useSelectSettingsColorMode();
  // misc
  const tag = (
    <Tag
      borderRadius="full"
      colorScheme="blue"
      size={size}
      variant={colorMode === 'dark' ? 'solid' : 'outline'}
    >
      <TagLeftIcon as={IoEyeOutline} />
      <TagLabel>{t('labels.watch')}</TagLabel>
    </Tag>
  );

  if (tooltipLabel) {
    return <Tooltip label={tooltipLabel}>{tag}</Tooltip>;
  }

  return tag;
};

export default WatchAccountBadge;
