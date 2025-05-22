import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { type FC, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// components
import Button from '@common/components/Button';
import AVMNameBadge from '@provider/components/avm-names/AVMNameBadge';
import ModalItem from '@provider/components/ModalItem';
import ModalSubHeading from '@provider/components/ModalSubHeading';
import ModalTextItem from '@provider/components/ModalTextItem';
import OpenTabIconButton from '@provider/components/OpenTabIconButton';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@common/constants';

// enums
import { AVMNameTypeEnum } from '@provider/enums';

// hooks
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';
import useSubTextColor from '@provider/hooks/useSubTextColor';

// selectors
import {
  useSelectActiveAccount,
  useSelectSettingsColorMode,
  useSelectSettingsPreferredBlockExplorer,
} from '@provider/selectors';

// theme
import { theme } from '@common/theme';

// types
import type { TProps } from './types';

// utils
import formatID from '@provider/utils/formatID';
import ellipseAddress from '@common/utils/ellipseAddress';
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';

const AVMNameModal: FC<TProps> = ({ item, network, onClose }) => {
  const { t } = useTranslation();
  const initialRef = useRef<HTMLButtonElement | null>(null);
  // selectors
  const account = useSelectActiveAccount();
  const colorMode = useSelectSettingsColorMode();
  const explorer = useSelectSettingsPreferredBlockExplorer();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // memos
  const address = useMemo(() => {
    if (!account) {
      return null;
    }

    return convertPublicKeyToAVMAddress(account.publicKey);
  }, [account]);
  const loadingHeading = useMemo(() => faker.random.alpha(12), []);
  const loadingText = useMemo(() => faker.random.alpha(32), []);
  // handlers
  const handleClose = () => onClose?.();
  const handleOnDoneClick = () => handleClose();
  // renders
  const renderHeader = useCallback(() => {
    if (!item) {
      return (
        <>
          <Skeleton>
            <Heading color={defaultTextColor} size="md" textAlign="center" w="full">
              {loadingHeading}
            </Heading>
          </Skeleton>

          <Skeleton>
            <Text color={defaultTextColor} fontSize="sm" textAlign="center" w="full">
              {loadingText}
            </Text>
          </Skeleton>
        </>
      );
    }

    return (
      <>
        <Heading color={defaultTextColor} size="md" textAlign="center" w="full">
          {item.name}
        </Heading>

        {/*address*/}
        {address && (
          <Tooltip label={address}>
            <Text color={subTextColor} fontSize="sm" textAlign="center" w="full">
              {ellipseAddress(address, {
                end: 10,
                start: 10,
              })}
            </Text>
          </Tooltip>
        )}
      </>
    );
  }, [address, defaultTextColor, item, loadingHeading, loadingText, subTextColor]);
  const renderBody = useCallback(() => {
    if (!item || !network || !network.enVoi) {
      return (
        <VStack align="center" spacing={DEFAULT_GAP / 3} w="full">
          <Skeleton>
            <Heading color={defaultTextColor} size="lg">
              {loadingHeading}
            </Heading>
          </Skeleton>

          <Skeleton>
            <Text color={defaultTextColor}>{loadingText}</Text>
          </Skeleton>
        </VStack>
      );
    }

    return (
      <VStack align="center" spacing={0} w="full">
        <ModalSubHeading color={defaultTextColor} text={t<string>('headings.details')} />

        {/*token id*/}
        <ModalTextItem
          copyButtonLabel={t<string>('labels.copyTokenID')}
          isCode={true}
          label={t<string>('labels.tokenId')}
          tooltipLabel={item.tokenID}
          value={formatID(item.tokenID, true)}
        />

        {/*app id*/}
        <HStack spacing={1} w="full">
          <ModalTextItem
            copyButtonLabel={t<string>('labels.copyApplicationId')}
            isCode={true}
            label={t<string>('labels.applicationId')}
            tooltipLabel={network.enVoi.contractID()}
            value={formatID(network.enVoi.contractID())}
          />

          {/*open in explorer button*/}
          {explorer && (
            <OpenTabIconButton
              size="sm"
              tooltipLabel={t<string>('captions.openOn', {
                name: explorer.canonicalName,
              })}
              url={explorer.applicationURL(network.enVoi.contractID())}
            />
          )}
        </HStack>

        {/*type*/}
        <ModalItem
          label={t<string>('labels.type')}
          value={<AVMNameBadge colorMode={colorMode} type={AVMNameTypeEnum.EnVoi} />}
        />
      </VStack>
    );
  }, [colorMode, defaultTextColor, explorer, item, loadingHeading, loadingText, network]);

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={!!item}
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
      >
        {/*header*/}
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <VStack align="center" justify="center" spacing={1} w="full">
            {renderHeader()}
          </VStack>
        </ModalHeader>

        {/*body*/}
        <ModalBody display="flex" px={DEFAULT_GAP}>
          <VStack align="center" justify="flex-start" spacing={DEFAULT_GAP} w="full">
            {renderBody()}
          </VStack>
        </ModalBody>

        {/*footer*/}
        <ModalFooter p={DEFAULT_GAP}>
          <Button colorMode={colorMode} onClick={handleOnDoneClick} ref={initialRef} size="lg" variant="solid" w="full">
            {t<string>('buttons.dismiss')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AVMNameModal;
