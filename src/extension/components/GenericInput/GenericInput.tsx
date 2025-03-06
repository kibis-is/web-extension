import {
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowForwardOutline } from 'react-icons/io5';
import { randomBytes } from 'tweetnacl';

// components
import IconButton from '@common/components/IconButton';
import InformationIcon from '@extension/components/InformationIcon';
import Label from '@common/components/Label';

// constants
import { DEFAULT_GAP, INPUT_HEIGHT } from '@common/constants';

// hooks
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { TProps } from './types';

const GenericInput: FC<TProps> = ({
  charactersRemaining,
  colorMode,
  error,
  id,
  informationText,
  isLoading = false,
  label,
  required = false,
  validate,
  onSubmit,
  ...inputProps
}) => {
  const { t } = useTranslation();
  // hooks
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  // misc
  const _id = id || encodeBase64URLSafe(randomBytes(6));
  // handlers
  const handleOnSubmit = () => onSubmit && onSubmit();
  // renders
  const renderRightInputIcon = () => {
    if (!informationText && !onSubmit) {
      return null;
    }

    return (
      <InputRightElement h={INPUT_HEIGHT}>
        <HStack
          alignItems="center"
          h={INPUT_HEIGHT}
          justifyContent="center"
          spacing={0}
        >
          {informationText && (
            <InformationIcon
              ariaLabel={t<string>('ariaLabels.informationIcon')}
              tooltipLabel={informationText}
            />
          )}
          {onSubmit && (
            <Tooltip label={t<string>('buttons.submit')}>
              <IconButton
                aria-label={t<string>('ariaLabels.forwardArrow')}
                borderRadius="full"
                colorMode={colorMode}
                icon={IoArrowForwardOutline}
                isLoading={isLoading}
                onClick={handleOnSubmit}
                size="sm"
                variant="ghost"
              />
            </Tooltip>
          )}
        </HStack>
      </InputRightElement>
    );
  };

  return (
    <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
      {/*label*/}
      <Label
        colorMode={colorMode}
        error={error}
        inputID={_id}
        label={label}
        px={DEFAULT_GAP - 2}
        required={required}
      />

      {/*input*/}
      <InputGroup size="md">
        <Input
          {...inputProps}
          borderRadius="full"
          focusBorderColor={error ? 'red.300' : primaryColor}
          id={_id}
          isInvalid={!!error}
          h={INPUT_HEIGHT}
          w="full"
        />

        {renderRightInputIcon()}
      </InputGroup>

      {/*character limit*/}
      {typeof charactersRemaining === 'number' && (
        <Text
          color={charactersRemaining >= 0 ? subTextColor : 'red.300'}
          fontSize="xs"
          px={DEFAULT_GAP - 2}
          textAlign="right"
          w="full"
        >
          {t<string>('captions.charactersRemaining', {
            amount: charactersRemaining,
          })}
        </Text>
      )}
    </VStack>
  );
};

export default GenericInput;
