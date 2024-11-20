import { Tag, TagLabel, TagLeftIcon, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// icons
import KbPasskey from '@extension/icons/KbPasskey';

// types
import type { IProps } from './types';

const PasskeyAccountBadge: FC<IProps> = ({ size = 'sm', tooltipLabel }) => {
  const { t } = useTranslation();
  // misc
  const tag = (
    <Tag borderRadius="full" colorScheme="teal" size={size} variant="solid">
      <TagLeftIcon as={KbPasskey} />
      <TagLabel>{t('labels.passkey')}</TagLabel>
    </Tag>
  );

  if (tooltipLabel) {
    return <Tooltip label={tooltipLabel}>{tag}</Tooltip>;
  }

  return tag;
};

export default PasskeyAccountBadge;
