import { Icon, IconButton, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoOpenOutline } from 'react-icons/io5';
import browser from 'webextension-polyfill';

// hooks
import useButtonHoverBackgroundColor from '@provider/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';

interface IProps {
  size?: string;
  tooltipLabel: string;
  url: string;
}

const OpenTabIconButton: FC<IProps> = ({ size = 'sm', tooltipLabel, url }: IProps) => {
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  // handlers
  const handleOpenClick = () =>
    browser.tabs.create({
      url: encodeURI(url),
    });

  return (
    <Tooltip arrowSize={15} hasArrow={true} label={tooltipLabel} placement="bottom">
      <IconButton
        _hover={{ bg: buttonHoverBackgroundColor }}
        aria-label="Open url in a new tab"
        icon={<Icon as={IoOpenOutline} color={defaultTextColor} />}
        onClick={handleOpenClick}
        size={size}
        variant="ghost"
      />
    </Tooltip>
  );
};

export default OpenTabIconButton;
