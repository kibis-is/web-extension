import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Text,
} from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';

// constants
import { DEFAULT_GAP, INPUT_HEIGHT } from '@extension/constants';

// hooks
import useBorderColor from '@extension/hooks/useBorderColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// types
import type { IProps } from './types';

const MoreInformationAccordion: FC<IProps> = ({
  children,
  color,
  fontSize,
  isOpen,
  label,
  minButtonHeight,
  onChange,
}) => {
  const { t } = useTranslation();
  // hooks
  const borderColor = useBorderColor();
  const defaultTextColor = useDefaultTextColor();
  // handlers
  const handleOnChange = (value: number) => onChange(value > -1);

  return (
    <Accordion
      allowToggle={true}
      index={isOpen ? 0 : -1}
      onChange={handleOnChange}
      w="full"
    >
      <AccordionItem border="none" w="full">
        <AccordionButton
          borderColor={borderColor}
          borderRadius="full"
          borderStyle="solid"
          borderWidth="1px"
          h={INPUT_HEIGHT}
          px={DEFAULT_GAP - 2}
        >
          <Text
            color={color || defaultTextColor}
            fontSize={fontSize}
            textAlign="left"
            w="full"
          >
            {label || t<string>('labels.moreInformation')}
          </Text>

          <AccordionIcon color={color || defaultTextColor} />
        </AccordionButton>

        <AccordionPanel pb={0} pt={DEFAULT_GAP / 3} px={0}>
          {children}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default MoreInformationAccordion;
