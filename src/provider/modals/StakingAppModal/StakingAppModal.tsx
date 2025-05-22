import {
  Avatar,
  AvatarBadge,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  SkeletonCircle,
  Tag,
  TagLabel,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { faker } from '@faker-js/faker';
import React, { type FC, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IoFlagOutline } from 'react-icons/io5';

// components
import Button from '@common/components/Button';
import InfoIconTooltip from '@provider/components/information/InfoIconTooltip';
import ModalAccountItem from '@provider/components/modals/ModalAccountItem';
import ModalItem from '@provider/components/modals/ModalItem';
import ModalSubHeading from '@provider/components/modals/ModalSubHeading';
import ModalTextItem from '@provider/components/modals/ModalTextItem';
import MoreInformationAccordion from '@provider/components/information/MoreInformationAccordion';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP, MODAL_ITEM_HEIGHT } from '@common/constants';

// hooks
import useDefaultAvatarBackgroundColor from '@provider/hooks/useDefaultAvatarBackgroundColor';
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@provider/hooks/usePrimaryColorScheme';
import useSubTextColor from '@provider/hooks/useSubTextColor';

// selectors
import {
  useSelectAccounts,
  useSelectSettingsColorMode,
  useSelectSettingsPreferredBlockExplorer,
} from '@provider/selectors';

// theme
import { theme } from '@common/theme';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import ellipseAddress from '@common/utils/ellipseAddress';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';
import createIconFromDataUri from '@provider/utils/createIconFromDataUri';

const StakingAppModal: FC<IProps> = ({ onClose, app, network }) => {
  const { t } = useTranslation();
  const initialRef = useRef<HTMLButtonElement | null>(null);
  const {
    isOpen: isMoreInformationAccordionOpen,
    onClose: onMoreInformationAccordionClose,
    onOpen: onMoreInformationAccordionOpen,
  } = useDisclosure();
  // selectors
  const accounts = useSelectAccounts();
  const colorMode = useSelectSettingsColorMode();
  const explorer = useSelectSettingsPreferredBlockExplorer();
  // hooks
  const defaultAvatarBackgroundColor = useDefaultAvatarBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // memos
  const address = useMemo(() => (app ? convertPublicKeyToAVMAddress(app.publicKey) : null), [app]);
  const loadingHeading = useMemo(() => faker.random.alpha(12), []);
  const loadingText = useMemo(() => faker.random.alpha(32), []);
  // handlers
  const handleClose = () => onClose && onClose();
  const handleOnDoneClick = () => handleClose();
  const handleOnMoreInformationToggle = (value: boolean) =>
    value ? onMoreInformationAccordionOpen() : onMoreInformationAccordionClose();
  // renders
  const renderContent = () => {
    let availableBalanceInStandardUnits: BigNumber;
    let balanceInStandardUnits: BigNumber;
    let lockUpExpiresAt: Date;
    let lockUpStartsAt: Date;

    if (!app || !network) {
      return (
        <>
          <VStack alignItems="center" spacing={DEFAULT_GAP - 2} w="full">
            <SkeletonCircle size="24" />

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
          </VStack>
        </>
      );
    }

    availableBalanceInStandardUnits = convertToStandardUnit(
      new BigNumber(app.availableBalance),
      network.nativeCurrency.decimals
    );
    balanceInStandardUnits = convertToStandardUnit(new BigNumber(app.balance), network.nativeCurrency.decimals);
    lockUpStartsAt = new Date(parseInt(app.lockupStartedAt, 10));
    lockUpExpiresAt = new Date(lockUpStartsAt);

    lockUpExpiresAt.setFullYear(lockUpStartsAt.getFullYear() + app.lockupYears);

    return (
      <>
        {/*header*/}
        <VStack align="center" spacing={DEFAULT_GAP - 2} w="full">
          {/*icon*/}
          <Tooltip
            label={t<string>(
              app.status === 'online' ? 'captions.stakingAppStatusOnline' : 'captions.stakingAppStatusOffline'
            )}
          >
            <Avatar
              bg={defaultAvatarBackgroundColor}
              icon={<Icon as={IoFlagOutline} color="white" boxSize={calculateIconSize('md')} />}
              size="md"
            >
              <AvatarBadge
                bg={app.status === 'online' ? 'green.500' : 'red.300'}
                borderColor={BODY_BACKGROUND_COLOR}
                borderWidth={1}
                boxSize="1em"
                placement="bottom-end"
              />
            </Avatar>
          </Tooltip>

          <VStack align="center" spacing={1} w="full">
            {/*balance*/}
            <HStack align="center" spacing={1}>
              <Tooltip
                label={formatCurrencyUnit(balanceInStandardUnits, {
                  decimals: network.nativeCurrency.decimals,
                })}
              >
                <Heading color={defaultTextColor} size="lg" textAlign="center">
                  {formatCurrencyUnit(balanceInStandardUnits, {
                    decimals: balanceInStandardUnits.lt(1) ? network.nativeCurrency.decimals : 2,
                  })}
                </Heading>
              </Tooltip>

              {/*currency icon*/}
              {createIconFromDataUri(network.nativeCurrency.iconUrl, {
                boxSize: calculateIconSize('sm'),
                color: defaultTextColor,
              })}

              <InfoIconTooltip color={subTextColor} label={t<string>('captions.stakingAppBalanceInfo')} />
            </HStack>

            {/*available balance*/}
            <HStack align="center" spacing={1}>
              <Tooltip
                label={formatCurrencyUnit(availableBalanceInStandardUnits, {
                  decimals: network.nativeCurrency.decimals,
                })}
              >
                <Text color={subTextColor} textAlign="center">
                  {formatCurrencyUnit(availableBalanceInStandardUnits, {
                    decimals: availableBalanceInStandardUnits.lt(1) ? network.nativeCurrency.decimals : 2,
                  })}
                </Text>
              </Tooltip>

              {/*currency icon*/}
              {createIconFromDataUri(network.nativeCurrency.iconUrl, {
                boxSize: calculateIconSize('xs'),
                color: subTextColor,
              })}

              <InfoIconTooltip label={t<string>('captions.stakingAppAvailableBalanceInfo')} color={subTextColor} />
            </HStack>
          </VStack>
        </VStack>

        {/*details*/}
        <VStack align="center" spacing={0} w="full">
          <ModalSubHeading color={defaultTextColor} text={t<string>('headings.details')} />

          {/*account*/}
          {address && (
            <ModalAccountItem
              accounts={accounts}
              address={address}
              explorer={explorer}
              label={t<string>('labels.account')}
              network={network}
              showCopyButton={true}
            />
          )}

          {/*app id*/}
          <ModalTextItem
            copyButtonLabel={t<string>('labels.copyApplicationId')}
            isCode={true}
            label={t<string>('labels.applicationId')}
            tooltipLabel={app.appID}
            value={app.appID}
          />

          {/*type*/}
          {app.phase > 0 && (
            <ModalItem
              label={t<string>('labels.type')}
              value={
                <Tag colorScheme={primaryColorScheme} size="sm" variant={colorMode === 'dark' ? 'solid' : 'subtle'}>
                  <TagLabel>
                    {t<string>('labels.stakingPhase', {
                      number: app.phase + 1,
                    })}
                  </TagLabel>
                </Tag>
              }
            />
          )}

          <MoreInformationAccordion
            color={defaultTextColor}
            fontSize="sm"
            isOpen={isMoreInformationAccordionOpen}
            minButtonHeight={MODAL_ITEM_HEIGHT}
            onChange={handleOnMoreInformationToggle}
          >
            <VStack align="center" spacing={0} w="full">
              {/*lock-up years*/}
              <ModalTextItem label={t<string>('labels.lockUpYears')} value={app.lockupYears.toString()} />

              {/*lock-up expires at*/}
              <ModalTextItem label={t<string>('labels.lockUpExpiresAt')} value={lockUpExpiresAt.toLocaleString()} />

              {/*participation key expires at*/}
              {app.participationKeyExpiresAt && (
                <ModalTextItem
                  label={t<string>('labels.participationKeyExpiresAt')}
                  value={new Date(parseInt(app.participationKeyExpiresAt, 10)).toLocaleString()}
                  warningLabel={t<string>('captions.participationKeyExpiresAtWarning')}
                />
              )}
            </VStack>
          </MoreInformationAccordion>
        </VStack>
      </>
    );
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={!!app}
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
          <VStack alignItems="center" justifyContent="center" spacing={1} w="full">
            <Heading color={defaultTextColor} size="md" textAlign="center" w="full">
              {t<string>('headings.stakingApplication')}
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
          </VStack>
        </ModalHeader>

        {/*body*/}
        <ModalBody display="flex" px={DEFAULT_GAP}>
          <VStack alignItems="center" justifyContent="flex-start" spacing={DEFAULT_GAP} w="full">
            {renderContent()}
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

export default StakingAppModal;
