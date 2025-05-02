import {
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import React, {
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import browser from 'webextension-polyfill';

// components
import Button from '@common/components/Button';
import PasswordInput from '@extension/components/PasswordInput';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@common/constants';

// hooks
import useGenericInput from '@extension/hooks/useGenericInput';

// selectors
import {
  useSelectLogger,
  useSelectSettingsColorMode,
} from '@extension/selectors';

// managers
import PasswordManager from '@extension/managers/PasswordManager';

// theme
import { theme } from '@common/theme';

// types
import type { IProps } from './types';
import { IoCheckmarkOutline } from 'react-icons/io5';

const ConfirmPasswordModal: FC<IProps> = ({
  isOpen,
  hint,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  // selectors
  const colorMode = useSelectSettingsColorMode();
  const logger = useSelectLogger();
  // hooks
  const {
    error: passwordError,
    label: passwordLabel,
    required: isPasswordRequired,
    reset: resetPassword,
    setError: setPasswordError,
    setValue: setPasswordValue,
    validate: validatePassword,
    value: passwordValue,
  } = useGenericInput({
    required: true,
    label: t<string>('labels.password'),
  });
  // states
  const [verifying, setVerifying] = useState<boolean>(false);
  // misc
  const reset = () => {
    resetPassword();
    setVerifying(false);
  };
  // handlers
  const handleCancelClick = () => handleClose();
  const handleConfirmClick = async () => {
    let isValid: boolean;
    let passwordManager: PasswordManager;

    // check if the input is valid
    if (!!passwordError || !!validatePassword(passwordValue)) {
      return;
    }

    passwordManager = new PasswordManager({
      logger,
      passwordTag: browser.runtime.id,
    });

    setVerifying(true);

    isValid = await passwordManager.verifyPassword(passwordValue);

    setVerifying(false);

    if (!isValid) {
      setPasswordError(t<string>('errors.inputs.invalidPassword'));

      return;
    }

    onConfirm(passwordValue);
    handleClose();
  };
  const handleClose = () => {
    onClose && onClose();

    reset(); // clean up
  };
  const handleKeyUpPasswordInput = async (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      await handleConfirmClick();
    }
  };
  const handleOnPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    validatePassword(event.target.value);
    setPasswordValue(event.target.value);
  };

  // set focus when opening
  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);

  return (
    <Modal
      initialFocusRef={passwordInputRef}
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalOverlay />

      <ModalContent
        alignSelf="flex-end"
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
        minH={0}
      >
        {/*content*/}
        <ModalBody px={DEFAULT_GAP}>
          <VStack w="full">
            <PasswordInput
              colorMode={colorMode}
              disabled={verifying}
              error={passwordError}
              hint={hint || t<string>('captions.mustEnterPasswordToConfirm')}
              inputRef={passwordInputRef}
              label={passwordLabel}
              onChange={handleOnPasswordChange}
              onKeyUp={handleKeyUpPasswordInput}
              required={isPasswordRequired}
              value={passwordValue || ''}
            />
          </VStack>
        </ModalBody>

        {/*footer*/}
        <ModalFooter p={DEFAULT_GAP}>
          <HStack spacing={DEFAULT_GAP - 2} w="full">
            <Button
              colorMode={colorMode}
              onClick={handleCancelClick}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.cancel')}
            </Button>

            <Button
              colorMode={colorMode}
              isLoading={verifying}
              onClick={handleConfirmClick}
              rightIcon={<IoCheckmarkOutline />}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.confirm')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmPasswordModal;
