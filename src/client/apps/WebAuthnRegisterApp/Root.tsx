import {
  Avatar,
  Box,
  HStack,
  Text,
  type TextProps,
  VStack,
} from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCloseOutline } from 'react-icons/io5';

// components
import AccountItem from '@client/components/AccountItem';
import Button from '@common/components/Button';
import CircularProgressWithIcon from '@common/components/CircularProgressWithIcon';
import IconButton from '@common/components/IconButton';
import Notice from '@common/components/Notice';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@common/constants';
import {
  EXTERNAL_POPUP_MAX_HEIGHT,
  EXTERNAL_POPUP_MAX_WIDTH,
} from '@client/constants';

// enums
import { ErrorCodeEnum } from '@common/enums';

// hooks
import useDefaultTextColor from '@common/hooks/useDefaultTextColor';
import useTextBackgroundColor from '@common/hooks/useTextBackgroundColor';

// icons
import KbPasskey from '@extension/icons/KbPasskey';
import KbSignIn from '@extension/icons/KbSignIn';

// theme
import { theme } from '@common/theme';

// types
import type { IRootProps } from './types';

const Root: FC<IRootProps> = ({
  clientInfo,
  colorMode,
  error,
  fontFamily,
  onCancelClick,
  onRegisterClick,
  onTryAgainClick,
  result,
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
  // renders
  const renderBody = () => {
    let errorMessage = t<string>('errors.descriptions.generic');

    if (error) {
      switch (error.code) {
        case ErrorCodeEnum.WebAuthnNotEnabledError:
        case ErrorCodeEnum.WebAuthnRegistrationCanceledError:
          errorMessage = t<string>('errors.descriptions.code', {
            context: error.code,
          });
          break;
        default:
          break;
      }

      return <Notice message={errorMessage} size="xs" type="error" w="full" />;
    }

    if (result) {
      return (
        <AccountItem
          account={result.account}
          colorMode={colorMode}
          fontFamily={fontFamily}
        />
      );
    }

    return (
      <VStack spacing={DEFAULT_GAP - 2} w="full">
        {/*passkey loader*/}
        <CircularProgressWithIcon colorMode={colorMode} icon={KbPasskey} />

        {/*caption*/}
        <Text
          {...textProps}
          color={defaultTextColor}
          fontFamily={fontFamily}
          fontSize="xs"
          p={0}
          textAlign="center"
          width="full"
        >
          {t<string>('captions.webAuthnRegisterRequestWaiting')}
        </Text>
      </VStack>
    );
  };
  const renderCTAButton = () => {
    if (error) {
      return (
        <Button
          colorMode={colorMode}
          onClick={onTryAgainClick}
          size="sm"
          variant="solid"
          w="full"
        >
          {t<string>('buttons.tryAgain')}
        </Button>
      );
    }

    if (result) {
      return (
        <Button
          colorMode={colorMode}
          onClick={onRegisterClick}
          rightIcon={<KbSignIn />}
          size="sm"
          variant="solid"
          w="full"
        >
          {t<string>('buttons.register')}
        </Button>
      );
    }

    return null;
  };

  return (
    <VStack backgroundColor="transparent" m={DEFAULT_GAP - 2}>
      <VStack
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderRadius={theme.radii['3xl']}
        maxH={EXTERNAL_POPUP_MAX_HEIGHT}
        p={DEFAULT_GAP / 2}
        shadow="lg"
        spacing={DEFAULT_GAP}
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
        <VStack flexGrow={1} spacing={DEFAULT_GAP} w="full">
          {renderBody()}
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

          {renderCTAButton()}
        </HStack>
      </VStack>
    </VStack>
  );
};

export default Root;
