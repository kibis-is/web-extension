import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { type FC, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { IoFolderOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import ActionItem from '@extension/components/ActionItem';
import Button from '@extension/components/Button';
import GenericInput from '@extension/components/GenericInput';
import ModalSubHeading from '@extension/components/ModalSubHeading';
import ScrollableContainer from '@extension/components/ScrollableContainer';

// constants
import {
  ACCOUNT_GROUP_NAME_BYTE_LIMIT,
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
} from '@extension/constants';

// features
import {
  saveAccountGroupIDThunk,
  saveAccountGroupsThunk,
} from '@extension/features/accounts';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useGenericInput from '@extension/hooks/useGenericInput';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// repositories
import AccountGroupRepository from '@extension/repositories/AccountGroupRepository';

// selectors
import {
  useSelectActiveAccount,
  useSelectAccountsSaving,
  useSelectAccountGroups,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAccountGroup,
  IAccountWithExtendedProps,
  IAppThunkDispatch,
  IMainRootState,
} from '@extension/types';
import type { IProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import convertToKebabCase from '@extension/utils/convertToKebabCase';
import ellipseAddress from '@extension/utils/ellipseAddress';

const AddAccountToGroupModal: FC<IProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const account = useSelectActiveAccount();
  const groups = useSelectAccountGroups();
  const saving = useSelectAccountsSaving();
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
    characterLimit: ACCOUNT_GROUP_NAME_BYTE_LIMIT,
    label: t<string>('labels.name'),
  });
  const subTextColor = useSubTextColor();
  // handlers
  const handleOnAddGroupSubmit = async () => {
    if (nameValue.length <= 0 || !!validateName(nameValue)) {
      return;
    }

    // add the new group
    await dispatch(
      saveAccountGroupsThunk([
        AccountGroupRepository.initializeDefaultAccountGroup(nameValue),
      ])
    ).unwrap();

    // reset input
    resetName();
  };
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    // reset inputs
    resetName();
    // close
    onClose && onClose();
  };
  const handleOnKeyUp = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      await handleOnAddGroupSubmit();
    }
  };
  const handleOnSelect = (groupID: string) => async () => {
    let _account: IAccountWithExtendedProps | null;
    let group: IAccountGroup | null;

    if (!account) {
      return;
    }

    group = groups.find(({ id }) => id === groupID) || null;
    _account = await dispatch(
      saveAccountGroupIDThunk({
        accountID: account.id,
        groupID,
      })
    ).unwrap();

    if (_account && group) {
      dispatch(
        createNotification({
          description: t<string>('captions.addedToGroup', {
            group: group.name,
          }),
          ephemeral: true,
          title: t<string>('headings.accountUpdated'),
          type: 'info',
        })
      );
    }

    handleClose();
  };
  // renders
  const renderGroupItems = () => {
    if (groups.length <= 0) {
      return (
        <VStack flexGrow={1} w="full">
          <Text color={subTextColor} fontSize="sm" textAlign="center" w="full">
            {t<string>('captions.noGroupsAvailable')}
          </Text>
        </VStack>
      );
    }

    return (
      <ScrollableContainer showScrollBars={true} w="full">
        {groups.map((value, index) => (
          <ActionItem
            icon={IoFolderOutline}
            isSelected={value.id === account?.groupID}
            key={`${convertToKebabCase(value.name)}-${index}`}
            label={value.name}
            onClick={handleOnSelect(value.id)}
          />
        ))}
      </ScrollableContainer>
    );
  };

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
        {/*header*/}
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <VStack
            alignItems="center"
            justifyContent="center"
            spacing={1}
            w="full"
          >
            <Heading
              color={defaultTextColor}
              size="md"
              textAlign="center"
              w="full"
            >
              {t<string>('headings.selectGroup')}
            </Heading>

            {/*address*/}
            {account && (
              <Tooltip label={convertPublicKeyToAVMAddress(account.publicKey)}>
                <Text
                  color={subTextColor}
                  fontSize="sm"
                  textAlign="center"
                  w="full"
                >
                  {ellipseAddress(
                    convertPublicKeyToAVMAddress(account.publicKey),
                    {
                      end: 10,
                      start: 10,
                    }
                  )}
                </Text>
              </Tooltip>
            )}
          </VStack>
        </ModalHeader>

        {/*body*/}
        <ModalBody display="flex" px={DEFAULT_GAP}>
          <VStack flexGrow={1} spacing={DEFAULT_GAP - 2} w="full">
            <ModalSubHeading text={t<string>('headings.addGroup')} />
            {/*add group*/}
            <GenericInput
              charactersRemaining={nameCharactersRemaining}
              error={nameError}
              label={nameLabel}
              isDisabled={saving}
              isLoading={saving}
              onBlur={nameOnBlur}
              onChange={nameOnChange}
              onKeyUp={handleOnKeyUp}
              onSubmit={handleOnAddGroupSubmit}
              required={isNameRequired}
              placeholder={t<string>('placeholders.groupName')}
              type="text"
              validate={validateName}
              value={nameValue}
            />

            <ModalSubHeading text={t<string>('headings.chooseGroup')} />

            {/*choose group*/}
            {renderGroupItems()}
          </VStack>
        </ModalBody>

        {/*footer*/}
        <ModalFooter p={DEFAULT_GAP}>
          {/*cancel button*/}
          <Button
            onClick={handleCancelClick}
            size="lg"
            variant="outline"
            w="full"
          >
            {t<string>('buttons.cancel')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddAccountToGroupModal;
