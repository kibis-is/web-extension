import { Modal } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// components
import ARC0300KeyRegistrationTransactionSendModalContent, {
  ARC0300KeyRegistrationTransactionSendModalContentSkeleton,
} from '@provider/components/ARC0300KeyRegistrationTransactionSendModalContent';

// enums
import { EventTypeEnum } from '@provider/enums';

// events
import ARC0300KeyRegistrationTransactionSendEvent from '@provider/events/ARC0300KeyRegistrationTransactionSendEvent';

// features
import { removeEventByIdThunk } from '@provider/features/events';

// selectors
import { useSelectEvents, useSelectSettingsColorMode } from '@provider/selectors';

// types
import type { IAppThunkDispatch, IMainRootState, IModalProps } from '@provider/types';

const ARC0300KeyRegistrationTransactionSendEventModal: FC<IModalProps> = ({ onClose }) => {
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const colorMode = useSelectSettingsColorMode();
  const events = useSelectEvents();
  // state
  const [event, setEvent] = useState<ARC0300KeyRegistrationTransactionSendEvent | null>(null);
  // misc
  const _context = 'arc-0300-key-registration-send-event-modal';
  // handlers
  const handleClose = async () => {
    if (event) {
      // remove the event
      await dispatch(removeEventByIdThunk(event.id)).unwrap();
    }

    onClose && onClose();
  };

  useEffect(() => {
    setEvent(
      (events.find(
        (value) => value.type === EventTypeEnum.ARC0300KeyRegistrationTransactionSend
      ) as ARC0300KeyRegistrationTransactionSendEvent) || null
    );
  }, [events]);

  return (
    <Modal isOpen={!!event} motionPreset="slideInBottom" onClose={handleClose} size="full" scrollBehavior="inside">
      {event ? (
        <ARC0300KeyRegistrationTransactionSendModalContent
          colorMode={colorMode}
          onComplete={handleClose}
          onCancel={handleClose}
          schemaOrSchemas={event.payload}
        />
      ) : (
        <ARC0300KeyRegistrationTransactionSendModalContentSkeleton />
      )}
    </Modal>
  );
};

export default ARC0300KeyRegistrationTransactionSendEventModal;
