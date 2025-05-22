import { Text, Textarea, VStack } from '@chakra-ui/react';
import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { randomBytes } from '@stablelib/random';

// components
import Label from '@common/components/Label';

// constants
import { DEFAULT_GAP } from '@common/constants';

// hooks
import usePrimaryColor from '@provider/hooks/usePrimaryColor';
import useSubTextColor from '@provider/hooks/useSubTextColor';

// types
import type { TProps } from './types';

const GenericTextarea: FC<TProps> = ({
  charactersRemaining,
  colorMode,
  error,
  id,
  label,
  required = false,
  validate,
  ...textAreaProps
}) => {
  const { t } = useTranslation();
  // hooks
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  // misc
  const _id = id || encodeBase64URLSafe(randomBytes(6));

  return (
    <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
      <Label colorMode={colorMode} error={error} inputID={_id} label={label} px={DEFAULT_GAP - 2} required={required} />

      {/*textarea*/}
      <Textarea
        {...textAreaProps}
        borderRadius="md"
        focusBorderColor={error ? 'red.300' : primaryColor}
        id={_id}
        isInvalid={!!error}
        w="full"
      />

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

export default GenericTextarea;
