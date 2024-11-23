import { Avatar, Box, HStack, Text, TextProps, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCloseOutline } from 'react-icons/io5';

// components
// import AccountSelect from '@extension/components/AccountSelect';
import Button from '@external/components/Button';
import IconButton from '@external/components/IconButton';
// import ModalSubHeading from '@extension/components/ModalSubHeading';

// constants
import {
  EXTERNAL_POPUP_MAX_HEIGHT,
  EXTERNAL_POPUP_MAX_WIDTH,
} from '@external/constants';
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@external/hooks/useDefaultTextColor';
import useTextBackgroundColor from '@external/hooks/useTextBackgroundColor';

// icons
import KbSignIn from '@extension/icons/KbSignIn';

// theme
import { theme } from '@extension/theme';

// types
import type { IRootProps } from './types';

const Root: FC<IRootProps> = ({
  clientInfo,
  colorMode,
  fetching,
  fontFamily,
  onCancelClick,
  onRegisterClick,
  saving,
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);
  const textBackgroundColor = useTextBackgroundColor(colorMode);
  // misc
  const textProps: Partial<TextProps> = {
    fontFamily,
    m: 0,
  };

  return (
    <VStack backgroundColor="transparent" m={DEFAULT_GAP - 2}>
      <VStack
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderRadius={theme.radii['3xl']}
        maxH={EXTERNAL_POPUP_MAX_HEIGHT}
        p={DEFAULT_GAP / 2}
        shadow="lg"
        w={EXTERNAL_POPUP_MAX_WIDTH}
      >
        {/*header*/}
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
              {...textProps}
              color={defaultTextColor}
              fontSize="xs"
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
                {...textProps}
                color={defaultTextColor}
                fontSize="xs"
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
            onClick={onCancelClick}
            size="xs"
            variant="ghost"
          />
        </HStack>

        {/*body*/}
        <VStack flexGrow={1} spacing={DEFAULT_GAP / 3} w="full">
          <Text
            {...textProps}
            color={defaultTextColor}
            fontSize="xs"
            textAlign="justify"
            width="full"
          >
            {t<string>('captions.webAuthnCreateDescription')}
          </Text>

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

        {/*footer*/}
        <HStack spacing={DEFAULT_GAP / 3} w="full">
          <Button
            colorMode={colorMode}
            onClick={onCancelClick}
            size="sm"
            variant="outline"
            w="full"
          >
            {t<string>('buttons.cancel')}
          </Button>

          <Button
            colorMode={colorMode}
            isLoading={saving}
            onClick={onRegisterClick}
            rightIcon={<KbSignIn />}
            size="sm"
            variant="solid"
            w="full"
          >
            {t<string>('buttons.register')}
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default Root;
