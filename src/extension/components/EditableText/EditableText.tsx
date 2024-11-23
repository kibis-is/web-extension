import {
  Box,
  HStack,
  Input,
  Skeleton,
  Text,
  type TextProps,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { IoCheckmarkOutline, IoCloseOutline } from 'react-icons/io5';

// components
import IconButton from '@common/components/IconButton';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@common/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// theme
import { theme } from '@extension/theme';

// types
import type { TProps } from './types';

const EditableText: FC<TProps> = ({
  characterLimit,
  colorMode,
  isEditing = false,
  isLoading = false,
  onCancel,
  onSubmit,
  placeholder,
  value,
  ...textProps
}) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  const textBackgroundColor = useTextBackgroundColor();
  // memos
  const loadingText = useMemo(
    () => faker.random.alphaNumeric(12).toUpperCase(),
    []
  );
  const charactersRemaining = useMemo(
    () =>
      characterLimit
        ? characterLimit - new TextEncoder().encode(value).byteLength
        : null,
    [value]
  );
  // state
  const [_charactersRemaining, setCharactersRemaining] = useState<
    number | null
  >(charactersRemaining);
  const [_value, setValue] = useState<string>(value);
  // handlers
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    setCharactersRemaining(charactersRemaining);
    setValue(value);
    onCancel();
  };
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    let byteLength: number;

    // update the characters remaining
    if (characterLimit) {
      byteLength = new TextEncoder().encode(event.target.value).byteLength;

      setCharactersRemaining(characterLimit - byteLength);
    }

    setValue(event.target.value);
  };
  const handleOnKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmitClick();
    }
  };
  const handleSubmitClick = () => {
    if (
      (typeof _charactersRemaining === 'number' && _charactersRemaining < 0) ||
      _value.length <= 0
    ) {
      return;
    }

    onSubmit(_value);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  useEffect(() => setValue(value), [value]);

  if (isLoading) {
    return (
      <Skeleton>
        <Text color={defaultTextColor} textAlign="left">
          {loadingText}
        </Text>
      </Skeleton>
    );
  }

  if (!isEditing) {
    return <Text {...textProps}>{value}</Text>;
  }

  return (
    <VStack position="relative" w="full" zIndex={1}>
      {/*/input*/}
      <Input
        borderRadius="full"
        focusBorderColor={
          (typeof _charactersRemaining === 'number' &&
            _charactersRemaining < 0) ||
          _value.length <= 0
            ? 'red.300'
            : primaryColor
        }
        onChange={handleOnChange}
        onKeyUp={handleOnKeyUp}
        p={DEFAULT_GAP / 3}
        placeholder={placeholder}
        ref={inputRef}
        type="text"
        value={_value}
      />

      {/*controls*/}
      <HStack
        alignItems="center"
        justifyContent="space-between"
        position="absolute"
        right={0}
        top="calc(100% + var(--chakra-space-2))"
        w="full"
      >
        {/*characters remaining*/}
        {typeof _charactersRemaining === 'number' && (
          <Box
            bg={textBackgroundColor}
            borderRadius="full"
            boxShadow="lg"
            px={DEFAULT_GAP / 3}
            py={1}
          >
            <Text
              color={_charactersRemaining >= 0 ? subTextColor : 'red.300'}
              fontSize="xs"
              textAlign="center"
              w="full"
            >
              {t<string>('captions.charactersRemaining', {
                amount: _charactersRemaining,
              })}
            </Text>
          </Box>
        )}

        <HStack spacing={1}>
          {/*submit*/}
          <Box
            bg={BODY_BACKGROUND_COLOR}
            borderRadius={theme.radii['md']}
            boxShadow="lg"
          >
            <IconButton
              _hover={{ backgroundColor: buttonHoverBackgroundColor }}
              aria-label={t<string>('ariaLabels.checkIcon')}
              bg={textBackgroundColor}
              colorMode={colorMode}
              icon={IoCheckmarkOutline}
              onClick={handleSubmitClick}
              size="sm"
              type="submit"
              variant="ghost"
            />
          </Box>

          {/*cancel*/}
          <Box
            bg={BODY_BACKGROUND_COLOR}
            borderRadius={theme.radii['md']}
            boxShadow="lg"
          >
            <IconButton
              _hover={{ backgroundColor: buttonHoverBackgroundColor }}
              aria-label={t<string>('ariaLabels.crossIcon')}
              bg={textBackgroundColor}
              colorMode={colorMode}
              icon={IoCloseOutline}
              onClick={handleCancelClick}
              size="sm"
              variant="ghost"
            />
          </Box>
        </HStack>
      </HStack>
    </VStack>
  );
};

export default EditableText;
