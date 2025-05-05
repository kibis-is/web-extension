import { Button as ChakraButton, Icon, Text, Tooltip, useDisclosure } from '@chakra-ui/react';
import { randomString } from '@stablelib/random';
import React, { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronDownOutline } from 'react-icons/io5';

// constants
import { DEFAULT_GAP } from '@common/constants';

// hooks
import useBorderColor from '@provider/hooks/useBorderColor';
import useButtonHoverBackgroundColor from '@provider/hooks/useButtonHoverBackgroundColor';
import useSubTextColor from '@provider/hooks/useSubTextColor';

// modals
import EnVoiSelectModal from './EnVoiSelectModal';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';

const EnVoiSelect: FC<IProps> = ({ names, onSelect, selectedIndex, size }) => {
  const { t } = useTranslation();
  const { isOpen: isSelectModalOpen, onClose: onSelectClose, onOpen: onSelectModalOpen } = useDisclosure();
  // hooks
  const borderColor = useBorderColor();
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const subTextColor = useSubTextColor();
  // memos
  const context = useMemo(() => randomString(8), []);
  const selectedName = useMemo(() => names[selectedIndex] || names[0], [names, selectedIndex]);
  // misc
  const iconSize = calculateIconSize('sm');
  // handlers
  const handleOnClick = () => onSelectModalOpen();
  const handleOnSelect = (index: number) => onSelect(index);

  return (
    <>
      {/*select modal*/}
      <EnVoiSelectModal
        context={context}
        isOpen={isSelectModalOpen}
        names={names}
        onClose={onSelectClose}
        onSelect={handleOnSelect}
        selectedIndex={selectedIndex}
      />

      <Tooltip label={t<string>('labels.chooseAEnVoi')}>
        <ChakraButton
          _hover={{
            bg: buttonHoverBackgroundColor,
            borderColor: borderColor,
          }}
          alignItems="center"
          borderColor="transparent"
          borderStyle="solid"
          borderWidth="1px"
          borderRadius="full"
          h="auto"
          justifyContent="space-between"
          onClick={handleOnClick}
          px={DEFAULT_GAP / 3}
          py={1}
          rightIcon={<Icon as={IoChevronDownOutline} boxSize={iconSize} color={subTextColor} />}
          variant="ghost"
        >
          <Text color={subTextColor} fontSize={size}>
            {selectedName}
          </Text>
        </ChakraButton>
      </Tooltip>
    </>
  );
};

export default EnVoiSelect;
