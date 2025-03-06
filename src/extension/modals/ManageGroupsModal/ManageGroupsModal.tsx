import {
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { randomString } from '@stablelib/random';
import React, { type FC, KeyboardEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoFolderOutline,
  IoPencilOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@common/components/Button';
import EditableText from '@extension/components/EditableText';
import GenericInput from '@extension/components/GenericInput';
import IconButton from '@common/components/IconButton';
import ModalSubHeading from '@extension/components/ModalSubHeading';
import ScrollableContainer from '@extension/components/ScrollableContainer';

// constants
import {
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  INPUT_HEIGHT,
} from '@common/constants';
import { ACCOUNT_GROUP_NAME_BYTE_LIMIT } from '@extension/constants';

// features
import {
  removeGroupByIDThunk,
  saveAccountGroupsThunk,
} from '@extension/features/accounts';
import { openConfirmModal } from '@extension/features/layout';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useGenericInput from '@extension/hooks/useGenericInput';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// repositories
import AccountGroupRepository from '@extension/repositories/AccountGroupRepository';

// selectors
import {
  useSelectAccounts,
  useSelectAccountsSaving,
  useSelectAccountGroups,
  useSelectManageGroupsModalIsOpen,
  useSelectSettingsColorMode,
} from '@extension/selectors';

// theme
import { theme } from '@common/theme';

// types
import type {
  IAppThunkDispatch,
  IMainRootState,
  IModalProps,
} from '@extension/types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';

const ManageGroupsModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const accounts = useSelectAccounts();
  const colorMode = useSelectSettingsColorMode();
  const isOpen = useSelectManageGroupsModalIsOpen();
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
  // memo
  const _context = useMemo(() => randomString(9), []);
  // states
  const [editingGroupID, setEditingGroupID] = useState<string | null>(null);
  // handlers
  const handleOnAddSubmit = async () => {
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
  const handleOnEditCancel = () => setEditingGroupID(null);
  const handleOnEditClick = (id: string) => () => setEditingGroupID(id);
  const handleOnEditSubmit = (id: string) => (value: string) => {
    const group = groups.find((_value) => _value.id === id) || null;

    setEditingGroupID(null);

    if (!group || value === group.name || value.length <= 0) {
      return;
    }

    dispatch(
      saveAccountGroupsThunk([
        {
          ...group,
          name: value,
        },
      ])
    );
  };
  const handleOnKeyUp = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      await handleOnAddSubmit();
    }
  };
  const handleOnRemoveClick = (id: string) => async () => {
    const group = groups.find((value) => value.id === id) || null;
    let numberOfAccounts: number;

    if (!group) {
      return;
    }

    numberOfAccounts = AccountGroupRepository.numberOfAccountsInGroup(
      id,
      accounts
    );

    // for groups with no accounts, just remove without warning
    if (numberOfAccounts <= 0) {
      dispatch(removeGroupByIDThunk(id));

      return;
    }

    dispatch(
      openConfirmModal({
        description: t<string>('captions.removeGroupConfirm', {
          group: group.name,
          numberOfAccounts,
        }),
        onConfirm: () => dispatch(removeGroupByIDThunk(id)),
        title: t<string>('headings.removeGroup'),
        warningText: t<string>('captions.removeGroupConfirmWarning'),
      })
    );
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
        {groups.map((value) => (
          <HStack
            alignItems="center"
            justifyContent="flex-start"
            h={INPUT_HEIGHT}
            key={`${_context}-${value.id}`}
            m={0}
            p={DEFAULT_GAP / 2}
            spacing={DEFAULT_GAP - 2}
            w="full"
          >
            {/*icon*/}
            <Icon
              as={IoFolderOutline}
              boxSize={calculateIconSize('md')}
              color={defaultTextColor}
            />

            {/*name*/}
            <HStack flexGrow={1} spacing={1} w="full">
              <Text color={defaultTextColor} textAlign="left">
                {`(${AccountGroupRepository.numberOfAccountsInGroup(
                  value.id,
                  accounts
                )})`}
              </Text>

              <EditableText
                characterLimit={ACCOUNT_GROUP_NAME_BYTE_LIMIT}
                color={defaultTextColor}
                colorMode={colorMode}
                flexGrow={1}
                isEditing={!!editingGroupID && editingGroupID === value.id}
                noOfLines={1}
                onCancel={handleOnEditCancel}
                onSubmit={handleOnEditSubmit(value.id)}
                textAlign="left"
                w="full"
                value={value.name}
              />
            </HStack>

            {/*edit button*/}
            <Tooltip label={t<string>('labels.editGroup')}>
              <IconButton
                aria-label={t<string>('ariaLabels.pencilIcon')}
                colorMode={colorMode}
                icon={IoPencilOutline}
                onClick={handleOnEditClick(value.id)}
                size="sm"
                variant="ghost"
              />
            </Tooltip>

            {/*remove button*/}
            <Tooltip label={t<string>('labels.remove')}>
              <IconButton
                aria-label={t<string>('ariaLabels.deleteIcon')}
                colorMode={colorMode}
                icon={IoTrashOutline}
                onClick={handleOnRemoveClick(value.id)}
                size="sm"
                variant="ghost"
              />
            </Tooltip>
          </HStack>
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
          <Heading
            color={defaultTextColor}
            size="md"
            textAlign="center"
            w="full"
          >
            {t<string>('headings.manageGroups')}
          </Heading>
        </ModalHeader>

        {/*body*/}
        <ModalBody display="flex" px={DEFAULT_GAP}>
          <VStack flexGrow={1} spacing={DEFAULT_GAP - 2} w="full">
            <ModalSubHeading text={t<string>('headings.addGroup')} />
            {/*add group*/}
            <GenericInput
              charactersRemaining={nameCharactersRemaining}
              colorMode={colorMode}
              error={nameError}
              label={nameLabel}
              isDisabled={saving}
              isLoading={saving}
              onBlur={nameOnBlur}
              onChange={nameOnChange}
              onKeyUp={handleOnKeyUp}
              onSubmit={handleOnAddSubmit}
              required={isNameRequired}
              placeholder={t<string>('placeholders.groupName')}
              type="text"
              validate={validateName}
              value={nameValue}
            />

            <ModalSubHeading text={t<string>('headings.editGroups')} />

            {/*remove groups*/}
            {renderGroupItems()}
          </VStack>
        </ModalBody>

        {/*footer*/}
        <ModalFooter p={DEFAULT_GAP}>
          {/*cancel button*/}
          <Button
            colorMode={colorMode}
            onClick={handleCancelClick}
            size="lg"
            variant="solid"
            w="full"
          >
            {t<string>('buttons.done')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ManageGroupsModal;
