import {
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import { randomBytes } from 'tweetnacl';
import React, {
  forwardRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type RefAttributes,
  useState,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { IoEye, IoEyeOff } from 'react-icons/io5';

// components
import IconButton from '@common/components/IconButton';
import Label from '@common/components/Label';
import Link from '@extension/components/Link';
import StrengthMeter from '@extension/components/StrengthMeter';

// constants
import { DEFAULT_GAP, INPUT_HEIGHT } from '@common/constants';
import { STRONG_PASSWORD_POLICY_LINK } from '@extension/constants';

// hooks
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { TProps } from './types';

const NewPasswordInput: ForwardRefExoticComponent<
  PropsWithoutRef<TProps> & RefAttributes<HTMLInputElement>
> = forwardRef(
  ({ colorMode, error, id, label, score, value, ...inputProps }, ref) => {
    const { t } = useTranslation();
    // hooks
    const primaryColor = usePrimaryColor();
    const subTextColor = useSubTextColor();
    // state
    const [show, setShow] = useState<boolean>(false);
    // misc
    const _id = id || encodeBase64URLSafe(randomBytes(6));
    // handlers
    const handleShowHideClick = () => setShow(!show);

    return (
      <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
        {/*label*/}
        <Label
          colorMode={colorMode}
          error={error}
          inputID={_id}
          label={label || t<string>('labels.password')}
          px={DEFAULT_GAP - 2}
          required={true}
        />

        {/*input*/}
        <InputGroup size="md">
          <Input
            {...inputProps}
            autoComplete="new-password"
            borderRadius="full"
            focusBorderColor={error ? 'red.300' : primaryColor}
            h={INPUT_HEIGHT}
            id={_id}
            isInvalid={!!error}
            placeholder={t<string>('placeholders.enterPassword')}
            pr={DEFAULT_GAP * 2}
            ref={ref}
            type={show ? 'text' : 'password'}
            value={value}
            w="full"
          />

          <InputRightElement h={INPUT_HEIGHT}>
            <IconButton
              aria-label={t<string>('labels.showHidePassword')}
              borderRadius="full"
              colorMode={colorMode}
              icon={show ? IoEye : IoEyeOff}
              mr={DEFAULT_GAP / 3}
              onClick={handleShowHideClick}
              size="md"
              variant="ghost"
            />
          </InputRightElement>
        </InputGroup>

        {/*strong password policy*/}
        <VStack px={DEFAULT_GAP - 2} spacing={DEFAULT_GAP / 3} w="full">
          <Text color={subTextColor} fontSize="xs" textAlign="left">
            <Trans i18nKey="captions.passwordScoreInfo">
              To conform with our{' '}
              <Link
                fontSize="xs"
                href={STRONG_PASSWORD_POLICY_LINK}
                isExternal={true}
              >
                Strong Password Policy
              </Link>
              , you are required to use a sufficiently strong password. Password
              must be at least 8 characters.
            </Trans>
          </Text>

          <StrengthMeter score={score} />
        </VStack>
      </VStack>
    );
  }
);

export default NewPasswordInput;
