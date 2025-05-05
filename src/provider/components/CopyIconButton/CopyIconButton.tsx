import { Icon, IconButton, Tooltip, useClipboard } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoCheckmarkOutline, IoCopyOutline } from 'react-icons/io5';

// hooks
import useButtonHoverBackgroundColor from '@provider/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';

interface IProps {
  ariaLabel: string;
  tooltipLabel?: string;
  size?: string;
  value: string;
}

const CopyIconButton: FC<IProps> = ({ ariaLabel, tooltipLabel, size = 'sm', value }: IProps) => {
  const { hasCopied, onCopy } = useClipboard(value);
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const handleCopyClick = () => onCopy();

  return (
    <Tooltip arrowSize={15} hasArrow={true} label={tooltipLabel || ariaLabel} placement="bottom">
      <IconButton
        _hover={{ bg: buttonHoverBackgroundColor }}
        aria-label={ariaLabel}
        icon={
          hasCopied ? (
            <Icon as={IoCheckmarkOutline} color="green.400" />
          ) : (
            <Icon as={IoCopyOutline} color={defaultTextColor} />
          )
        }
        onClick={handleCopyClick}
        size={size}
        variant="ghost"
      />
    </Tooltip>
  );
};

export default CopyIconButton;
