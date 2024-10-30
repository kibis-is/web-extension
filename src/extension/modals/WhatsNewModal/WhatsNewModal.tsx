import {
  Checkbox,
  Heading,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react';
import React, { createRef, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import Link from '@extension/components/Link';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// features
import {
  saveDisableWhatsNewOnUpdateThunk,
  saveWhatsNewVersionThunk,
} from '@extension/features/system';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectWhatsNewModal,
  useSelectSystemWhatsNewInfo,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAppThunkDispatch,
  IMainRootState,
  IModalProps,
} from '@extension/types';

const WhatsNewModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const initialRef = createRef<HTMLButtonElement>();
  // selectors
  const whatsNewModalOpen = useSelectWhatsNewModal();
  const whatsNewInfo = useSelectSystemWhatsNewInfo();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // misc
  const features = [
    '💅 Change account icon.',
    '💅 Change account background color.',
    '🔁 Switch to new Voi testnet.',
  ];
  const fixes: string[] = [];
  // handlers
  const handleClose = () => {
    // mark as read
    dispatch(saveWhatsNewVersionThunk(__VERSION__));

    onClose && onClose();
  };
  const handleOnDisableOnUpdateChange = () => {
    if (!whatsNewInfo) {
      return;
    }

    dispatch(saveDisableWhatsNewOnUpdateThunk(!whatsNewInfo.disableOnUpdate));
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={whatsNewModalOpen}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalOverlay />

      <ModalContent
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} fontSize="lg" textAlign="center">
            {`What's New In Kibisis v${__VERSION__}`}
          </Heading>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={DEFAULT_GAP - 2} w="full">
            {/*community highlights*/}
            <Heading
              color={primaryColor}
              fontSize="md"
              textAlign="left"
              w="full"
            >
              Community Highlights
            </Heading>

            <Heading
              color={primaryColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              Airdrops Have Dropped!
            </Heading>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              On the 28th October 2024, all those that participated in the
              Testnet Phase 1 & 2 and Staking programs will have received their
              airdrops. For the Testnet program, 3.67% of the total token supply
              (367 million VOI) was allocated and 1.4% of the total token supply
              (140 million VOI) was allocated to the Staking program. Each
              program had an optional lock-up period, with the Testnet program
              having a higher lock-up period of upto 5 years, and, notably, 55%
              of the participants chose to lock-up for the full 5 years.
            </Text>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              These effort-based airdrops are testament to Voi's commitment to
              being a truly community-driven blockchain.
            </Text>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              You can check the state of your airdrop contracts using the
              beautifully crafted airdrop tool{' '}
              <Link
                fontSize="sm"
                href="https://staking.voi.network/"
                isExternal={true}
              >
                https://staking.voi.network/
              </Link>
              .
            </Text>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              For more information relating to the airdrops, check{' '}
              <Link
                fontSize="sm"
                href="https://medium.com/@voifoundation/airdrop-programs-everything-you-need-to-know-a84706bd8599"
                isExternal={true}
              >
                this
              </Link>{' '}
              blog post.
            </Text>

            {/*new release*/}
            <Heading
              color={primaryColor}
              fontSize="md"
              textAlign="left"
              w="full"
            >
              {`Version ${__VERSION__} Release`}
            </Heading>

            {/*features*/}
            {features.length > 0 && (
              <>
                <Heading
                  color={primaryColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  Features
                </Heading>

                <UnorderedList w="full">
                  {features.map((value, index) => (
                    <ListItem
                      key={`${WhatsNewModal.name}-features-list-${index}`}
                    >
                      <Text
                        color={defaultTextColor}
                        fontSize="sm"
                        textAlign="left"
                        w="full"
                      >
                        {value}
                      </Text>
                    </ListItem>
                  ))}
                </UnorderedList>
              </>
            )}

            {/*fixes*/}
            {fixes.length > 0 && (
              <>
                <Heading
                  color={primaryColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  Fixes
                </Heading>

                <UnorderedList w="full">
                  {fixes.map((value, index) => (
                    <ListItem key={`${WhatsNewModal.name}-fixes-list-${index}`}>
                      <Text
                        color={defaultTextColor}
                        fontSize="sm"
                        textAlign="left"
                        w="full"
                      >
                        {value}
                      </Text>
                    </ListItem>
                  ))}
                </UnorderedList>
              </>
            )}

            {/*extroduction*/}
            <Heading
              color={primaryColor}
              fontSize="md"
              textAlign="left"
              w="full"
            >
              Closing Words
            </Heading>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              {`Thank you for your continued interest in Kibisis! We hope you are enjoying using it.`}
            </Text>

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              {`It has been an epic ride so far, and we could not have got this far without you and your continued support.`}
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          <VStack alignItems="flex-start" spacing={DEFAULT_GAP - 2} w="full">
            {whatsNewInfo && (
              <Checkbox
                colorScheme={primaryColorScheme}
                isChecked={whatsNewInfo.disableOnUpdate}
                onChange={handleOnDisableOnUpdateChange}
              >
                <Text
                  color={subTextColor}
                  fontSize="xs"
                  textAlign="left"
                  w="full"
                >
                  {t<string>('captions.disableWhatsNewMessageOnUpdate')}
                </Text>
              </Checkbox>
            )}

            {/*ok*/}
            <Button
              onClick={handleClose}
              ref={initialRef}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.ok')}
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WhatsNewModal;
