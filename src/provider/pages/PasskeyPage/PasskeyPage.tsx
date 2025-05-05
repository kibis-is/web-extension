import { Text, VStack, useDisclosure, Icon, Skeleton, Code, HStack, InputGroup, Input } from '@chakra-ui/react';
import React, { ChangeEvent, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoTrashOutline } from 'react-icons/io5';
import { GoShield, GoShieldCheck, GoShieldLock } from 'react-icons/go';
import { useDispatch } from 'react-redux';

// components
import Button from '@common/components/Button';
import CopyIconButton from '@provider/components/CopyIconButton';
import COSEAlgorithmBadge from '@provider/components/COSEAlgorithmBadge';
import MoreInformationAccordion from '@provider/components/MoreInformationAccordion';
import PageHeader from '@provider/components/PageHeader';
import PageSubHeading from '@provider/components/PageSubHeading';
import PageItem from '@provider/components/PageItem';
import PasskeyCapabilities from '@provider/components/PasskeyCapabilities';

// constants
import { DEFAULT_GAP } from '@common/constants';
import { PAGE_ITEM_HEIGHT } from '@provider/constants';

// features
import { create as createNotification } from '@provider/features/notifications';

// hooks
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';
import usePrimaryColor from '@provider/hooks/usePrimaryColor';
import useSubTextColor from '@provider/hooks/useSubTextColor';

// managers
import PasskeyManager from '@provider/managers/PasskeyManager';

// modals
import AddPasskeyModal from '@provider/modals/AddPasskeyModal';
import RemovePasskeyModal from '@provider/modals/RemovePasskeyModal';

// selectors
import {
  useSelectLogger,
  useSelectPasskeysPasskey,
  useSelectPasskeysFetching,
  useSelectSystemInfo,
  useSelectPasskeysSaving,
  useSelectSettingsColorMode,
} from '@provider/selectors';

// types
import type { IAppThunkDispatch, IMainRootState, IPasskeyCredential } from '@provider/types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';

const PasskeyPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const {
    isOpen: isMoreInformationOpen,
    onOpen: onMoreInformationOpen,
    onClose: onMoreInformationClose,
  } = useDisclosure();
  // selectors
  const colorMode = useSelectSettingsColorMode();
  const logger = useSelectLogger();
  const passkey = useSelectPasskeysPasskey();
  const fetching = useSelectPasskeysFetching();
  const saving = useSelectPasskeysSaving();
  const systemInfo = useSelectSystemInfo();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  // states
  const [addPasskey, setAddPasskey] = useState<IPasskeyCredential | null>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const [passkeyName, setPasskeyName] = useState<string>('');
  const [removePasskey, setRemovePasskey] = useState<IPasskeyCredential | null>(null);
  // handlers
  const handleAddPasskeyClick = async () => {
    const _functionName = 'handleAddPasskeyClick';
    let _passkey: IPasskeyCredential;

    if (!systemInfo || !systemInfo.deviceID) {
      return;
    }

    setCreating(true);

    try {
      logger.debug(`${PasskeyPage.name}#${_functionName}: creating a new passkey`);

      _passkey = await PasskeyManager.createPasskeyCredential({
        deviceID: systemInfo.deviceID,
        logger,
        name: passkeyName,
      });

      logger.debug(`${PasskeyPage.name}#${_functionName}: new passkey "${_passkey.id}" created`);

      // set the add passkey to open the add passkey modal
      setAddPasskey(_passkey);
    } catch (error) {
      // show a notification
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
    }

    setCreating(false);
  };
  const handleAddPasskeyModalClose = () => setAddPasskey(null);
  const handleMoreInformationToggle = (value: boolean) => (value ? onMoreInformationOpen() : onMoreInformationClose());
  const handleOnNameChange = (event: ChangeEvent<HTMLInputElement>) => setPasskeyName(event.target.value);
  const handleRemovePasskeyClick = () => setRemovePasskey(passkey);
  const handleRemovePasskeyModalClose = () => setRemovePasskey(null);
  // renders
  const renderContent = () => {
    const iconSize = calculateIconSize('xl');

    // if passkeys are not supported for the browser
    if (!PasskeyManager.isSupported()) {
      return (
        <VStack alignItems="center" flexGrow={1} justifyContent="center" spacing={DEFAULT_GAP} w="full">
          {/*icon*/}
          <Icon as={GoShield} color="yellow.600" h={iconSize} w={iconSize} />

          {/*captions*/}
          <VStack alignItems="center" flexGrow={1} spacing={DEFAULT_GAP / 3} w="full">
            <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
              {t<string>('captions.passkeyNotSupported1')}
            </Text>

            <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
              {t<string>('captions.passkeyNotSupported2')}
            </Text>
          </VStack>
        </VStack>
      );
    }

    if (fetching) {
      return (
        <VStack alignItems="center" flexGrow={1} justifyContent="center" spacing={DEFAULT_GAP} w="full">
          {/*icon*/}
          <Skeleton>
            <Icon as={GoShield} color="yellow.600" h={iconSize} w={iconSize} />
          </Skeleton>

          {/*captions*/}
          <VStack alignItems="center" flexGrow={1} spacing={DEFAULT_GAP / 3} w="full">
            <Skeleton>
              <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
                {t<string>('captions.passkeyNotSupported1')}
              </Text>
            </Skeleton>

            <Skeleton>
              <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
                {t<string>('captions.passkeyNotSupported2')}
              </Text>
            </Skeleton>
          </VStack>
        </VStack>
      );
    }

    // if we have a passkey display the details
    if (passkey) {
      return (
        <>
          <VStack alignItems="center" flexGrow={1} spacing={DEFAULT_GAP} w="full">
            {/*icon*/}
            <Icon as={GoShieldCheck} color="green.600" h={iconSize} w={iconSize} />

            {/*details*/}
            <VStack spacing={DEFAULT_GAP / 3} w="full">
              <PageSubHeading text={t<string>('headings.details')} />

              {/*name*/}
              <PageItem fontSize="xs" label={t<string>('labels.id')}>
                <HStack spacing={1}>
                  <Code borderRadius="md" color={defaultTextColor} fontSize="xs" wordBreak="break-word">
                    {passkey.id}
                  </Code>

                  {/*copy id button*/}
                  <CopyIconButton
                    ariaLabel={t<string>('labels.copyId')}
                    tooltipLabel={t<string>('labels.copyId')}
                    value={passkey.id}
                  />
                </HStack>
              </PageItem>

              {/*credential id*/}
              <PageItem fontSize="xs" label={t<string>('labels.credentialID')}>
                <HStack spacing={1}>
                  <Code borderRadius="md" color={defaultTextColor} fontSize="xs" wordBreak="break-word">
                    {passkey.id}
                  </Code>

                  {/*copy credential id button*/}
                  <CopyIconButton
                    ariaLabel={t<string>('labels.copyCredentialID')}
                    tooltipLabel={t<string>('labels.copyCredentialID')}
                    value={passkey.id}
                  />
                </HStack>
              </PageItem>

              {/*user id*/}
              <PageItem fontSize="xs" label={t<string>('labels.name')}>
                <Text color={subTextColor} fontSize="xs" w="full">
                  {passkey.name}
                </Text>
              </PageItem>

              {/*capabilities*/}
              <PageItem fontSize="xs" label={t<string>('labels.capabilities')}>
                <PasskeyCapabilities capabilities={passkey.transports} />
              </PageItem>

              <MoreInformationAccordion
                color={defaultTextColor}
                fontSize="xs"
                isOpen={isMoreInformationOpen}
                minButtonHeight={PAGE_ITEM_HEIGHT}
                onChange={handleMoreInformationToggle}
              >
                <VStack spacing={0} w="full">
                  {/*public key*/}
                  <PageItem fontSize="xs" label={t<string>('labels.publicKey')}>
                    <HStack spacing={1}>
                      <Code borderRadius="md" color={defaultTextColor} fontSize="xs" wordBreak="break-word">
                        {passkey.publicKey || '-'}
                      </Code>

                      {/*copy public key button*/}
                      {passkey.publicKey && (
                        <CopyIconButton
                          ariaLabel={t<string>('labels.copyPublicKey')}
                          tooltipLabel={t<string>('labels.copyPublicKey')}
                          value={passkey.id}
                        />
                      )}
                    </HStack>
                  </PageItem>

                  {/*algorithm*/}
                  <PageItem fontSize="xs" label={t<string>('labels.algorithm')}>
                    <COSEAlgorithmBadge algorithm={passkey.algorithm} />
                  </PageItem>
                </VStack>
              </MoreInformationAccordion>
            </VStack>
          </VStack>

          <Button
            colorMode={colorMode}
            isLoading={saving}
            onClick={handleRemovePasskeyClick}
            rightIcon={<IoTrashOutline />}
            size="lg"
            variant="solid"
            w="full"
          >
            {t<string>('buttons.removePasskey')}
          </Button>
        </>
      );
    }

    return (
      <>
        <VStack alignItems="center" flexGrow={1} spacing={DEFAULT_GAP} w="full">
          {/*icon*/}
          <Icon as={GoShieldLock} color={defaultTextColor} h={iconSize} w={iconSize} />

          {/*captions*/}
          <VStack alignItems="center" spacing={DEFAULT_GAP / 3} w="full">
            <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
              {t<string>('captions.addPasskey1')}
            </Text>

            <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
              {t<string>('captions.addPasskey2')}
            </Text>

            <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
              {t<string>('captions.addPasskeyInstruction')}
            </Text>
          </VStack>

          {/*passkey name*/}
          <VStack justifyContent="center" w="full">
            <Text color={defaultTextColor} fontSize="sm" textAlign="left" w="full">
              {`${t<string>('labels.passkeyName')} ${t<string>('labels.optional')}`}
            </Text>

            <InputGroup size="md">
              <Input
                focusBorderColor={primaryColor}
                isDisabled={saving}
                onChange={handleOnNameChange}
                placeholder={t<string>('placeholders.passkeyName')}
                type="text"
                value={passkeyName || ''}
              />
            </InputGroup>
          </VStack>
        </VStack>

        <Button
          colorMode={colorMode}
          isLoading={creating}
          onClick={handleAddPasskeyClick}
          size="lg"
          variant="solid"
          w="full"
        >
          {t<string>('buttons.addPasskey')}
        </Button>
      </>
    );
  };

  return (
    <>
      {/*modals*/}
      <AddPasskeyModal addPasskey={addPasskey} onClose={handleAddPasskeyModalClose} />
      <RemovePasskeyModal onClose={handleRemovePasskeyModalClose} removePasskey={removePasskey} />

      <PageHeader colorMode={colorMode} title={t<string>('titles.page', { context: 'passkey' })} />

      <VStack flexGrow={1} pb={DEFAULT_GAP} px={DEFAULT_GAP} spacing={DEFAULT_GAP - 2} w="full">
        {renderContent()}
      </VStack>
    </>
  );
};

export default PasskeyPage;
