import {
  Input,
  InputGroup,
  InputRightElement,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronDownOutline } from 'react-icons/io5';
import { randomBytes } from '@stablelib/random';

// components
import Label from '@common/components/Label';
import IconButton from '@common/components/IconButton';

// constants
import { DEFAULT_GAP, INPUT_HEIGHT } from '@common/constants';

// hooks
import usePrimaryColor from '@common/hooks/usePrimaryColor';

// modals
import { AccountSelectModal } from '@extension/components/accounts/AccountSelect';

// types
import type { IAccountWithExtendedProps } from '@extension/types';
import type { TProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';

const AddressInput: FC<TProps> = ({
  accounts,
  allowWatchAccounts = true,
  colorMode,
  error,
  id,
  isDisabled,
  label,
  network,
  onSelect,
  required = false,
  selectButtonLabel,
  selectModalTitle,
  systemInfo,
  validate,
  ...inputProps
}) => {
  const { t } = useTranslation();
  const {
    isOpen: isAccountSelectModalOpen,
    onClose: onAccountSelectClose,
    onOpen: onAccountSelectModalOpen,
  } = useDisclosure();
  // hooks
  const primaryColor = usePrimaryColor(colorMode);
  // misc
  const _id = id || encodeBase64URLSafe(randomBytes(6));
  // handlers
  const handleOnClick = () => onAccountSelectModalOpen();
  const handleOnSelect = (_accounts: IAccountWithExtendedProps[]) => {
    const _value = _accounts[0]
      ? convertPublicKeyToAVMAddress(_accounts[0].publicKey)
      : null;

    return _value && onSelect && onSelect(_value);
  };

  return (
    <>
      {/*account select modal*/}
      <AccountSelectModal
        accounts={accounts}
        allowWatchAccounts={allowWatchAccounts}
        colorMode={colorMode}
        isOpen={isAccountSelectModalOpen}
        multiple={false}
        network={network}
        onClose={onAccountSelectClose}
        onSelect={handleOnSelect}
        systemInfo={systemInfo}
        title={selectModalTitle}
      />

      <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
        {/*label*/}
        <Label
          colorMode={colorMode}
          error={error}
          inputID={_id}
          label={label || t<string>('labels.address')}
          px={DEFAULT_GAP - 2}
          required={required}
        />

        {/*input*/}
        <InputGroup size="md">
          {/*input*/}
          <Input
            {...inputProps}
            borderRadius="full"
            focusBorderColor={error ? 'red.300' : primaryColor}
            id={_id}
            isDisabled={isDisabled}
            isInvalid={!!error}
            h={INPUT_HEIGHT}
            placeholder={t<string>('placeholders.enterAddress')}
            type="text"
            w="full"
          />

          <InputRightElement h={INPUT_HEIGHT}>
            {/*open account select modal button*/}
            <Tooltip
              label={selectButtonLabel || t<string>('labels.selectAccount')}
            >
              <IconButton
                aria-label={
                  selectButtonLabel || t<string>('labels.selectAccount')
                }
                borderRadius="full"
                colorMode={colorMode}
                isDisabled={isDisabled}
                icon={IoChevronDownOutline}
                onClick={handleOnClick}
                size="sm"
                variant="ghost"
              />
            </Tooltip>
          </InputRightElement>
        </InputGroup>
      </VStack>
    </>
  );
};

export default AddressInput;
