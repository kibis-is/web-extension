import { Avatar, Box, HStack, Text, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCloseOutline } from 'react-icons/io5';

// components
// import AccountSelect from '@extension/components/AccountSelect';
import IconButton from '@external/components/IconButton';
// import ModalSubHeading from '@extension/components/ModalSubHeading';

// constants
import { EXTERNAL_POPUP_WIDTH } from '@external/constants';
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@external/hooks/useDefaultTextColor';
import useTextBackgroundColor from '@external/hooks/useTextBackgroundColor';

// theme
import { theme } from '@extension/theme';

// types
import type { IRootProps } from './types';

const Root: FC<IRootProps> = ({
  clientInfo,
  colorMode,
  fontFamily,
  onCancel,
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);
  const textBackgroundColor = useTextBackgroundColor(colorMode);

  return (
    <VStack backgroundColor="transparent" m={DEFAULT_GAP - 2}>
      <VStack
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderRadius={theme.radii['3xl']}
        p={DEFAULT_GAP / 2}
        shadow="lg"
        w={EXTERNAL_POPUP_WIDTH}
      >
        {/*client details*/}
        <HStack align="start" spacing={DEFAULT_GAP / 3} w="full">
          {/*icon */}
          <Avatar
            fontFamily={fontFamily}
            name={clientInfo.appName}
            size="md"
            {...(clientInfo.iconUrl && {
              src: clientInfo.iconUrl,
            })}
          />

          <VStack align="start" justify="space-evenly" spacing={1} w="full">
            {/*name*/}
            <Text
              color={defaultTextColor}
              fontFamily={fontFamily}
              fontSize="xs"
              m={0}
              textAlign="left"
              width="full"
            >
              {clientInfo.appName}
            </Text>

            {/*host*/}
            <Box
              backgroundColor={textBackgroundColor}
              borderRadius={theme.radii['3xl']}
              px={DEFAULT_GAP / 3}
              py={0}
            >
              <Text
                color={defaultTextColor}
                fontFamily={fontFamily}
                fontSize="xs"
                m={0}
                textAlign="left"
              >
                {clientInfo.host}
              </Text>
            </Box>
          </VStack>

          <IconButton
            aria-label={t<string>('ariaLabels.crossIcon')}
            colorMode={colorMode}
            icon={IoCloseOutline}
            onClick={onCancel}
            size="xs"
            variant="ghost"
          />
        </HStack>
        {/*<ModalSubHeading text={t<string>('headings.selectAccount')} />*/}

        {/*account*/}
        {/*<AccountSelect*/}
        {/*  _context={_context}*/}
        {/*  accounts={accounts}*/}
        {/*  allowWatchAccounts={false}*/}
        {/*  disabled={fetching || saving}*/}
        {/*  label={t<string>('labels.account')}*/}
        {/*  onSelect={handleOnAccountSelect}*/}
        {/*  required={true}*/}
        {/*  value={account}*/}
        {/*/>*/}
      </VStack>
    </VStack>
  );
};

export default Root;
