import {
  Code,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsUsbSymbol } from 'react-icons/bs';
import { IoArrowBackOutline, IoDownloadOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import CircularProgressWithIcon from '@extension/components/CircularProgressWithIcon';
import CopyIconButton from '@extension/components/CopyIconButton';
import GenericInput from '@extension/components/GenericInput';
import ModalItem from '@extension/components/ModalItem';
import ModalSubHeading from '@extension/components/ModalSubHeading';
import ModalTextItem from '@extension/components/ModalTextItem';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import Notice from '@extension/components/Notice';
import PasskeyCapabilities from '@extension/components/PasskeyCapabilities';

// constants
import {
  ACCOUNT_NAME_BYTE_LIMIT,
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  MODAL_ITEM_HEIGHT,
} from '@extension/constants';

// enums
import { DelimiterEnum } from '@extension/enums';

// errors
import { BaseExtensionError } from '@extension/errors';

// features
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useGenericInput from '@extension/hooks/useGenericInput';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// icons
import KbPasskey from '@extension/icons/KbPasskey';

// types
import type { ICreatePasskeyResult } from '@extension/managers/PasskeyAccountManager';
// managers
import PasskeyAccountManager from '@extension/managers/PasskeyAccountManager';

// selectors
import {
  useSelectAccountsSaving,
  useSelectLogger,
  useSelectSystemInfo,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAccountWithExtendedProps,
  IAppThunkDispatch,
  IMainRootState,
} from '@extension/types';
import type { IProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';

const AddPasskeyAccountModal: FC<IProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const {
    isOpen: isMoreInformationOpen,
    onOpen: onMoreInformationOpen,
    onClose: onMoreInformationClose,
  } = useDisclosure();
  // selectors
  const logger = useSelectLogger();
  const saving = useSelectAccountsSaving();
  const systemInfo = useSelectSystemInfo();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const {
    charactersRemaining: nameCharactersRemaining,
    error: nameError,
    label: nameLabel,
    onBlur: nameOnBlur,
    onChange: nameOnChange,
    required: isNameRequired,
    reset: resetName,
    value: nameValue,
    validate: validateName,
  } = useGenericInput({
    characterLimit: ACCOUNT_NAME_BYTE_LIMIT,
    label: t<string>('labels.name'),
  });
  const subTextColor = useSubTextColor();
  // states
  const [passkeyResult, setPasskeyResult] =
    useState<ICreatePasskeyResult | null>(null);
  const [error, setError] = useState<BaseExtensionError | null>(null);
  const [requesting, setRequesting] = useState<boolean>(false);
  // misc
  const reset = () => {
    resetName();
    setError(null);
    setPasskeyResult(null);
    setRequesting(false);
  };
  // handlers
  const handleClose = () => {
    onClose && onClose();

    reset();
  };
  const handleOnCancelClick = async () => handleClose();
  const handleOnCreateClick = async () => {
    const _functionName = 'handleOnGetPasskeyClick';
    let result: ICreatePasskeyResult;

    if (!systemInfo?.deviceID) {
      return;
    }

    // reset the previous values
    setPasskeyResult(null);
    setError(null);

    setRequesting(true);

    logger.debug(
      `${AddPasskeyAccountModal.name}#${_functionName}: requesting passkey details`
    );

    try {
      // get the passkey
      result = await PasskeyAccountManager.createPasskeyAccount({
        logger,
        deviceID: systemInfo.deviceID,
      });
    } catch (error) {
      logger?.debug(`${AddPasskeyAccountModal.name}#${_functionName}:`, error);

      setRequesting(false);
      setError(error);

      return;
    }

    // create a new account
    setPasskeyResult(result);
    setRequesting(false);
  };
  const handleOnImportClick = async () => {
    let account: IAccountWithExtendedProps;

    if (
      !passkeyResult ||
      !!nameError ||
      [validateName(nameValue)].some((value) => !!value)
    ) {
      return;
    }

    onComplete({
      __delimiter: DelimiterEnum.Passkey,
      name: nameValue.length > 0 ? nameValue : null,
      passkey: passkeyResult.passkey,
      publicKey: passkeyResult.publicKey,
    });

    handleClose();
  };
  const handleOnPreviousClick = () => reset();
  const handleMoreInformationToggle = (value: boolean) =>
    value ? onMoreInformationOpen() : onMoreInformationClose();
  // renders
  const renderContent = () => {
    const iconSize = calculateIconSize('xl');
    let address: string;

    if (!passkeyResult?.passkey) {
      return (
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="flex-start"
          spacing={DEFAULT_GAP}
          w="full"
        >
          {/*icon*/}
          <Icon
            as={KbPasskey}
            color={defaultTextColor}
            h={iconSize}
            w={iconSize}
          />

          {/*description*/}
          <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
            {t<string>('captions.addPasskeyAccount')}
          </Text>

          {/*info*/}
          <Notice
            message={t<string>('captions.addPasskeyAccountInfo')}
            size="sm"
          />
        </VStack>
      );
    }

    if (requesting) {
      return (
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          spacing={DEFAULT_GAP}
          w="full"
        >
          {/*loader*/}
          <CircularProgressWithIcon
            icon={BsUsbSymbol}
            iconColor={defaultTextColor}
          />

          {/*caption*/}
          <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
            {t<string>('captions.fetchingPasskeyDetails')}
          </Text>
        </VStack>
      );
    }

    address = convertPublicKeyToAVMAddress(passkeyResult.publicKey);

    return (
      <VStack
        alignItems="center"
        flexGrow={1}
        justifyContent="flex-start"
        spacing={DEFAULT_GAP}
        w="full"
      >
        {/*icon*/}
        <Icon as={KbPasskey} color="green.600" h={iconSize} w={iconSize} />

        <VStack flexGrow={1} spacing={DEFAULT_GAP - 2} w="full">
          <ModalSubHeading text={t<string>('headings.passkeyDetails')} />

          {/*passkey details*/}
          <VStack spacing={DEFAULT_GAP / 3} w="full">
            {/*address*/}
            <ModalTextItem
              copyButtonLabel={t<string>('labels.copyAddress')}
              label={`${t<string>('labels.address')}:`}
              tooltipLabel={address}
              value={ellipseAddress(address, {
                end: 10,
                start: 10,
              })}
            />

            {/*capabilities*/}
            <ModalItem
              fontSize="xs"
              label={`${t<string>('labels.capabilities')}:`}
              value={
                <PasskeyCapabilities
                  capabilities={passkeyResult.passkey.transports}
                />
              }
            />

            <MoreInformationAccordion
              color={defaultTextColor}
              fontSize="xs"
              isOpen={isMoreInformationOpen}
              minButtonHeight={MODAL_ITEM_HEIGHT}
              onChange={handleMoreInformationToggle}
            >
              <VStack spacing={0} w="full">
                {/*credential id*/}
                <ModalItem
                  fontSize="xs"
                  label={`${t<string>('labels.credentialID')}:`}
                  value={
                    <HStack spacing={1}>
                      <Code
                        borderRadius="md"
                        color={defaultTextColor}
                        fontSize="xs"
                        wordBreak="break-word"
                      >
                        {passkeyResult.passkey.credentialID}
                      </Code>

                      {/*copy credential id button*/}
                      <CopyIconButton
                        ariaLabel={t<string>('labels.copyCredentialID')}
                        tooltipLabel={t<string>('labels.copyCredentialID')}
                        value={passkeyResult.passkey.credentialID}
                      />
                    </HStack>
                  }
                />

                {/*user id*/}
                <ModalItem
                  fontSize="xs"
                  label={`${t<string>('labels.userID')}:`}
                  value={
                    <HStack spacing={1}>
                      <Code
                        borderRadius="md"
                        color={defaultTextColor}
                        fontSize="xs"
                        wordBreak="break-word"
                      >
                        {passkeyResult.passkey.userID}
                      </Code>

                      {/*copy user id button*/}
                      <CopyIconButton
                        ariaLabel={t<string>('labels.copyUserID')}
                        tooltipLabel={t<string>('labels.copyUserID')}
                        value={passkeyResult.passkey.userID}
                      />
                    </HStack>
                  }
                />
              </VStack>
            </MoreInformationAccordion>
          </VStack>

          <ModalSubHeading text={t<string>('headings.accountName')} />

          {/*account name*/}
          <GenericInput
            charactersRemaining={nameCharactersRemaining}
            error={nameError}
            label={nameLabel}
            isDisabled={saving}
            onBlur={nameOnBlur}
            onChange={nameOnChange}
            required={isNameRequired}
            placeholder={t<string>('placeholders.nameAccount')}
            type="text"
            validate={validateName}
            value={nameValue}
          />
        </VStack>
      </VStack>
    );
  };

  // if there is an error from the hook, show a toast
  useEffect(() => {
    error &&
      dispatch(
        createNotification({
          description: t<string>('errors.descriptions.code', {
            code: error.code,
            context: error.code,
          }),
          ephemeral: true,
          title: t<string>('errors.titles.code', { context: error.code }),
          type: 'error',
        })
      );
  }, [error]);

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalContent
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.importAccount')}
          </Heading>
        </ModalHeader>

        <ModalBody display="flex" px={DEFAULT_GAP}>
          {renderContent()}
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          <HStack spacing={DEFAULT_GAP - 2} w="full">
            {!passkeyResult ? (
              <>
                {/*cancel*/}
                <Button
                  isDisabled={requesting}
                  onClick={handleOnCancelClick}
                  size="lg"
                  variant="outline"
                  w="full"
                >
                  {t<string>('buttons.cancel')}
                </Button>

                {/*add*/}
                <Button
                  isLoading={requesting}
                  onClick={handleOnCreateClick}
                  size="lg"
                  variant="solid"
                  w="full"
                >
                  {t<string>('buttons.getPasskey')}
                </Button>
              </>
            ) : (
              <>
                {/*previous*/}
                <Button
                  isDisabled={saving}
                  leftIcon={<IoArrowBackOutline />}
                  onClick={handleOnPreviousClick}
                  size="lg"
                  variant="outline"
                  w="full"
                >
                  {t<string>('buttons.previous')}
                </Button>

                {/*add*/}
                <Button
                  isLoading={saving}
                  onClick={handleOnImportClick}
                  rightIcon={<IoDownloadOutline />}
                  size="lg"
                  variant="solid"
                  w="full"
                >
                  {t<string>('buttons.import')}
                </Button>
              </>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddPasskeyAccountModal;
