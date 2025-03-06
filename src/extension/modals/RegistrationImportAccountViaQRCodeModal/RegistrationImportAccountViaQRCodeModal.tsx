import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBackOutline, IoDownloadOutline } from 'react-icons/io5';

// components
import Button from '@common/components/Button';
import NewAccountItem from '@extension/components/NewAccountItem';
import ScanModeModalContent from '@extension/components/ScanModeModalContent';
import ScanQRCodeViaCameraModalContent from '@extension/components/ScanQRCodeViaCameraModalContent';
import ScanQRCodeViaScreenCaptureModalContent from '@extension/components/ScanQRCodeViaScreenCaptureModalContent';
import ScanQRCodeViaTabModalContent from '@extension/components/ScanQRCodeViaTabModalContent';
import UnknownURIModalContent from '@extension/components/UnknownURIModalContent';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@common/constants';

// enums
import { ARC0300AuthorityEnum, ARC0300PathEnum } from '@extension/enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// selectors
import {
  useSelectLogger,
  useSelectNetworks,
  useSelectSettingsColorMode,
} from '@extension/selectors';

// theme
import { theme } from '@common/theme';

// types
import type {
  IARC0300AccountImportSchema,
  IARC0300BaseSchema,
  INewAccount,
} from '@extension/types';
import type { IProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';
import determinePaginationFromARC0300Schemas from '@extension/utils/determinePaginationFromARC0300Schemas';
import flattenAccountImportSchemaToNewAccounts from '@extension/utils/flattenAccountImportSchemaToNewAccounts';
import parseURIToARC0300Schema from '@extension/utils/parseURIToARC0300Schema';
import isARC0300SchemaPaginationComplete from '@extension/utils/isARC0300SchemaPaginationComplete';

const RegistrationImportAccountViaQRCodeModal: FC<IProps> = ({
  isOpen,
  onClose,
  onComplete,
  saving,
}) => {
  const { t } = useTranslation();
  // selectors
  const colorMode = useSelectSettingsColorMode();
  const logger = useSelectLogger();
  const networks = useSelectNetworks();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  // state
  const [scanViaCamera, setScanViaCamera] = useState<boolean>(false);
  const [scanViaScreenCapture, setScanViaScreenCapture] =
    useState<boolean>(false);
  const [scanViaTab, setScanViaTab] = useState<boolean>(false);
  const [uris, setURIs] = useState<string[]>([]);
  // misc
  const reset = () => {
    setURIs([]);
    setScanViaCamera(false);
    setScanViaScreenCapture(false);
    setScanViaTab(false);
  };
  // handlers
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    reset();
    onClose();
  };
  const handleImportClick = (accounts: INewAccount[]) => () =>
    onComplete(accounts);
  const handleOnURI = (uri: string) => {
    const index = uris.findIndex((value) => value === uri);

    // if the uri doesn't exist, add it
    if (index < 0) {
      setURIs([...uris, uri]);
    }
  };
  const handlePreviousClick = () => reset();
  const handleScanViaCameraClick = () => setScanViaCamera(true);
  const handleScanViaScreenCaptureClick = () => setScanViaScreenCapture(true);
  const handleScanViaTabClick = () => setScanViaTab(true);
  // renders
  const renderContent = () => {
    let accounts: INewAccount[];
    let pagination: [number, number] | null = null;
    let primeSchema: IARC0300BaseSchema | null;
    let schemas: IARC0300BaseSchema[];

    if (uris.length > 0) {
      schemas = uris.reduce((acc, currentValue) => {
        const schema = parseURIToARC0300Schema(currentValue, {
          logger,
          supportedNetworks: networks,
        });

        return !schema ? acc : [...acc, schema];
      }, []);

      primeSchema = schemas[0];

      // if the uri cannot be parsed or is not an account import
      if (
        !primeSchema ||
        primeSchema.authority !== ARC0300AuthorityEnum.Account ||
        primeSchema.paths[0] !== ARC0300PathEnum.Import
      ) {
        return (
          <UnknownURIModalContent
            colorMode={colorMode}
            onPreviousClick={handlePreviousClick}
            uri={uris[0]}
          />
        );
      }

      if (isARC0300SchemaPaginationComplete(schemas)) {
        accounts = flattenAccountImportSchemaToNewAccounts({
          accounts: [], // no accounts will exist in registration
          schemas: schemas as IARC0300AccountImportSchema[],
          logger,
        });

        return (
          <ModalContent
            backgroundColor={BODY_BACKGROUND_COLOR}
            borderTopRadius={theme.radii['3xl']}
            borderBottomRadius={0}
          >
            {/*header*/}
            <ModalHeader
              display="flex"
              justifyContent="center"
              px={DEFAULT_GAP}
            >
              <VStack
                alignItems="center"
                flexGrow={1}
                spacing={DEFAULT_GAP - 2}
                w="full"
              >
                <Heading color={defaultTextColor} size="md" textAlign="center">
                  {t<string>('headings.importAccount')}
                </Heading>

                <Text color={defaultTextColor} fontSize="sm" textAlign="center">
                  {t<string>('captions.importAccounts')}
                </Text>
              </VStack>
            </ModalHeader>

            {/*body*/}
            <ModalBody display="flex">
              <VStack spacing={DEFAULT_GAP / 3} w="full">
                {accounts.map(({ keyPair, name }, index) => (
                  <HStack
                    borderRadius="md"
                    borderWidth={1}
                    key={`account-import-account-item-${index}`}
                    justifyContent="center"
                    px={DEFAULT_GAP - 2}
                    py={DEFAULT_GAP / 3}
                    w="full"
                  >
                    <NewAccountItem
                      address={convertPublicKeyToAVMAddress(keyPair.publicKey)}
                      {...(name && { name })}
                    />

                    <Text
                      color={defaultTextColor}
                      fontSize="sm"
                      textAlign="center"
                      w="10%"
                    >
                      {index + 1}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </ModalBody>

            {/*footer*/}
            <ModalFooter p={DEFAULT_GAP}>
              <HStack spacing={DEFAULT_GAP - 2} w="full">
                {/*cancel button*/}
                <Button
                  colorMode={colorMode}
                  leftIcon={<IoArrowBackOutline />}
                  onClick={handleCancelClick}
                  size="lg"
                  variant="outline"
                  w="full"
                >
                  {t<string>('buttons.cancel')}
                </Button>

                {/*import button*/}
                <Button
                  colorMode={colorMode}
                  isLoading={saving}
                  onClick={handleImportClick(accounts)}
                  rightIcon={<IoDownloadOutline />}
                  size="lg"
                  variant="solid"
                  w="full"
                >
                  {t<string>('buttons.import')}
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        );
      }

      pagination = determinePaginationFromARC0300Schemas(schemas);
    }

    if (scanViaCamera) {
      return (
        <ScanQRCodeViaCameraModalContent
          colorMode={colorMode}
          onPreviousClick={handlePreviousClick}
          onURI={handleOnURI}
          {...(pagination && { pagination })}
        />
      );
    }

    if (scanViaScreenCapture) {
      return (
        <ScanQRCodeViaScreenCaptureModalContent
          colorMode={colorMode}
          onPreviousClick={handlePreviousClick}
          onURI={handleOnURI}
          {...(pagination && { pagination })}
        />
      );
    }

    if (scanViaTab) {
      return (
        <ScanQRCodeViaTabModalContent
          colorMode={colorMode}
          onPreviousClick={handlePreviousClick}
          onURI={handleOnURI}
          {...(pagination && { pagination })}
        />
      );
    }

    return (
      <ScanModeModalContent
        colorMode={colorMode}
        onCancelClick={handleCancelClick}
        onScanViaCameraClick={handleScanViaCameraClick}
        onScanViaScreenCaptureClick={handleScanViaScreenCaptureClick}
        onScanViaTabClick={handleScanViaTabClick}
      />
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
    >
      {renderContent()}
    </Modal>
  );
};

export default RegistrationImportAccountViaQRCodeModal;
