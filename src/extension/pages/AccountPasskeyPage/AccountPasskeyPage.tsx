import {
  Avatar,
  Code,
  HStack,
  Icon,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IoTrashOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// components
import Button from '@common/components/Button';
import CopyIconButton from '@extension/components/CopyIconButton';
import COSEAlgorithmBadge from '@extension/components/COSEAlgorithmBadge';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import PageHeader from '@extension/components/PageHeader';
import PageItem from '@extension/components/PageItem';

// constants
import { DEFAULT_GAP } from '@common/constants';
import { ACCOUNTS_ROUTE, PAGE_ITEM_HEIGHT } from '@extension/constants';

// features
import { removeAccountPasskeyByIDThunk } from '@extension/features/accounts';
import { openConfirmModal } from '@extension/features/layout';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// icons
import KbPasskey from '@extension/icons/KbPasskey';

// pages
import SkeletonPage from './SkeletonPage';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// selectors
import {
  useSelectActiveAccount,
  useSelectSettingsColorMode,
} from '@extension/selectors';

// types
import type { IAppThunkDispatch, IMainRootState } from '@extension/types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@common/utils/ellipseAddress';
import formatTimestamp from '@common/utils/formatTimestamp';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';

const AccountPasskeyPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const navigate = useNavigate();
  const { passkeyID } = useParams();
  const {
    isOpen: isMoreInformationToggleOpen,
    onOpen: onMoreInformationOpen,
    onClose: onMoreInformationClose,
  } = useDisclosure();
  // selectors
  const account = useSelectActiveAccount();
  const colorMode = useSelectSettingsColorMode();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // memos
  const iconSize = useMemo(() => calculateIconSize('md'), []);
  const passkey = useMemo(() => {
    if (!passkeyID) {
      return null;
    }

    return account?.passkeys.find(({ id }) => id === passkeyID) || null;
  }, [passkeyID]);
  // handlers
  const handleMoreInformationToggle = (value: boolean) =>
    value ? onMoreInformationOpen() : onMoreInformationClose();
  const handleOnRemovePasskeyClick = useCallback(() => {
    if (!account || !passkey) {
      return;
    }

    dispatch(
      openConfirmModal({
        description: t<string>('captions.removeAccountPasskeyConfirm', {
          name: passkey.rp.name,
        }),
        onConfirm: async () => {
          await dispatch(
            removeAccountPasskeyByIDThunk({
              accountID: account.id,
              passkeyID: passkey.id,
            })
          ).unwrap();
          dispatch(
            createNotification({
              ephemeral: true,
              title: t<string>('headings.removedPasskey'),
              type: 'info',
            })
          );
          navigate(ACCOUNTS_ROUTE, {
            replace: true,
          });
        },
        title: t<string>('headings.removePasskey'),
      })
    );
  }, [account, passkey]);
  const reset = () =>
    navigate(ACCOUNTS_ROUTE, {
      replace: true,
    });
  let accountAddress: string;

  // if we don't have the params, return to accounts page
  useEffect(() => {
    if (!passkeyID) {
      return reset();
    }
  }, []);

  if (!account || !passkey) {
    return <SkeletonPage />;
  }
  console.log('passkey', passkey);

  accountAddress = convertPublicKeyToAVMAddress(
    AccountRepository.decode(account.publicKey)
  );

  return (
    <>
      <PageHeader
        colorMode={colorMode}
        subTitle={ellipseAddress(accountAddress, { end: 10, start: 10 })}
        title={passkey.rp.name}
      />

      <VStack
        alignItems="center"
        flex={1}
        justifyContent="flex-start"
        px={DEFAULT_GAP - 2}
        spacing={DEFAULT_GAP - 2}
        w="full"
      >
        <VStack
          alignItems="center"
          justifyContent="flex-start"
          spacing={1}
          w="full"
        >
          {/*icon*/}
          <Avatar
            bg="green.500"
            icon={
              <Icon as={KbPasskey} color="white" h={iconSize} w={iconSize} />
            }
            size="md"
          />

          <VStack spacing={0} w="full">
            {/*name*/}
            <PageItem fontSize="xs" label={t<string>('labels.name')}>
              <Text
                color={defaultTextColor}
                fontSize="xs"
                maxW={200}
                noOfLines={1}
                textAlign="center"
              >
                {passkey.rp.name}
              </Text>
            </PageItem>

            {/*user*/}
            <PageItem fontSize="xs" label={t<string>('labels.user')}>
              <Text
                color={defaultTextColor}
                fontSize="xs"
                maxW={200}
                noOfLines={1}
                textAlign="center"
              >
                {passkey.user.displayName}
              </Text>
            </PageItem>

            {/*origin*/}
            <PageItem fontSize="xs" label={t<string>('labels.origin')}>
              <HStack spacing={1}>
                <Code
                  borderRadius="md"
                  color={defaultTextColor}
                  fontSize="xs"
                  wordBreak="break-word"
                >
                  {passkey.origin}
                </Code>

                <OpenTabIconButton
                  tooltipLabel={passkey.origin}
                  url={passkey.origin}
                />
              </HStack>
            </PageItem>

            {/*created*/}
            <PageItem fontSize="xs" label={t<string>('labels.created')}>
              <Text color={defaultTextColor} fontSize="xs" textAlign="center">
                {formatTimestamp(passkey.createdAt)}
              </Text>
            </PageItem>

            {/*last used*/}
            <PageItem fontSize="xs" label={t<string>('labels.lastUsed')}>
              <Text color={defaultTextColor} fontSize="xs" textAlign="center">
                {formatTimestamp(passkey.lastUsedAt)}
              </Text>
            </PageItem>

            <MoreInformationAccordion
              color={defaultTextColor}
              fontSize="xs"
              isOpen={isMoreInformationToggleOpen}
              minButtonHeight={PAGE_ITEM_HEIGHT}
              onChange={handleMoreInformationToggle}
            >
              <VStack spacing={0} w="full">
                {/*credential id*/}
                <PageItem
                  fontSize="xs"
                  label={t<string>('labels.credentialID')}
                >
                  <HStack spacing={1}>
                    <Code
                      borderRadius="md"
                      color={defaultTextColor}
                      fontSize="xs"
                      wordBreak="break-word"
                    >
                      {passkey.id}
                    </Code>

                    {/*copy button*/}
                    <CopyIconButton
                      ariaLabel={t<string>('labels.copyId')}
                      tooltipLabel={t<string>('labels.copyId')}
                      value={passkey.id}
                    />
                  </HStack>
                </PageItem>

                {/*relaying party id*/}
                <PageItem
                  fontSize="xs"
                  label={t<string>('labels.relayingPartyID')}
                >
                  <HStack spacing={1}>
                    <Code
                      borderRadius="md"
                      color={defaultTextColor}
                      fontSize="xs"
                      wordBreak="break-word"
                    >
                      {passkey.rp.id}
                    </Code>

                    {/*copy button*/}
                    <CopyIconButton
                      ariaLabel={t<string>('labels.copyId')}
                      tooltipLabel={t<string>('labels.copyId')}
                      value={passkey.rp.id}
                    />
                  </HStack>
                </PageItem>

                {/*algorithm*/}
                <PageItem fontSize="xs" label={t<string>('labels.algorithm')}>
                  <COSEAlgorithmBadge algorithm={passkey.alg} />
                </PageItem>
              </VStack>
            </MoreInformationAccordion>
          </VStack>
        </VStack>

        <Spacer />

        {/*remove button*/}
        <HStack
          alignItems="center"
          justifyContent="center"
          spacing={DEFAULT_GAP / 3}
          mb={DEFAULT_GAP - 2}
          w="full"
        >
          <Button
            colorMode={colorMode}
            onClick={handleOnRemovePasskeyClick}
            rightIcon={<IoTrashOutline />}
            size="lg"
            variant="solid"
            w="full"
          >
            {t<string>('buttons.remove')}
          </Button>
        </HStack>
      </VStack>
    </>
  );
};

export default AccountPasskeyPage;
