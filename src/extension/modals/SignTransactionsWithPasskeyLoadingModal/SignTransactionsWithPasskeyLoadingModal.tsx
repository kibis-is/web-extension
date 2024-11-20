import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// components
import CircularProgressWithIcon from '@extension/components/CircularProgressWithIcon';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// icons
import KbPasskey from '@extension/icons/KbPasskey';

// theme
import { theme } from '@extension/theme';

// types
import type { IProps } from './types';

const SignTransactionsWithPasskeyLoadingModal: FC<IProps> = ({
  signedTransactionStates,
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // memos
  const count = useMemo(
    () => signedTransactionStates.filter(({ signed }) => signed).length,
    [signedTransactionStates]
  );
  const total = useMemo(
    () => signedTransactionStates.length,
    [signedTransactionStates]
  );
  const incomplete = useMemo(() => count < total || total <= 0, [count, total]);

  return (
    <Modal
      isOpen={signedTransactionStates.length > 0}
      motionPreset="slideInBottom"
      onClose={() => {}}
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
          <VStack
            alignItems="center"
            flexGrow={1}
            justifyContent="center"
            spacing={DEFAULT_GAP}
            w="full"
          >
            {/*progress*/}
            <CircularProgressWithIcon
              icon={KbPasskey}
              iconColor={incomplete ? defaultTextColor : 'green.600'}
              progress={[count, total]}
              progressColor="green.600"
            />

            {/*caption*/}
            <Text
              color={subTextColor}
              fontSize="sm"
              textAlign="center"
              w="full"
            >
              {t<string>('captions.signTransactionsProgress', {
                count,
                total,
              })}
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SignTransactionsWithPasskeyLoadingModal;
