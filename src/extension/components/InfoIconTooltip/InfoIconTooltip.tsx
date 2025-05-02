import { Icon, Tooltip } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoInformationCircleOutline } from 'react-icons/io5';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// types
import type { IProps } from './types';

const InfoIconTooltip: FC<IProps> = ({ color, label }) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();

  return (
    <Tooltip label={label}>
      <span
        style={{
          height: '1em',
          lineHeight: '1em',
        }}
      >
        <Icon
          aria-label={t<string>('ariaLabels.informationIcon')}
          as={IoInformationCircleOutline}
          color={color || defaultTextColor}
        />
      </span>
    </Tooltip>
  );
};

export default InfoIconTooltip;
