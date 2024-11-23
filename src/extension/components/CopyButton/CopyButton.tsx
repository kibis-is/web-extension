import { ButtonProps, Icon, Tooltip, useClipboard } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoCheckmarkOutline, IoCopyOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

// components
import Button from '@common/components/Button';

// types
import type { TProps } from './types';

const CopyButton: FC<TProps> = ({
  colorMode,
  copiedTooltipLabel,
  value,
  ...buttonProps
}) => {
  const { t } = useTranslation();
  const { hasCopied, onCopy } = useClipboard(value);
  // handlers
  const handleCopyClick = () => onCopy();

  return (
    <Tooltip
      arrowSize={15}
      hasArrow={true}
      isOpen={hasCopied}
      label={copiedTooltipLabel || t<string>('captions.copied')}
      placement="bottom"
    >
      <Button
        {...buttonProps}
        colorMode={colorMode}
        onClick={handleCopyClick}
        rightIcon={
          hasCopied ? (
            <Icon as={IoCheckmarkOutline} />
          ) : (
            <Icon as={IoCopyOutline} />
          )
        }
      />
    </Tooltip>
  );
};

export default CopyButton;
