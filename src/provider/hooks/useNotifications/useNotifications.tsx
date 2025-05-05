import { useToast } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// components
import Toast from '@provider/components/Toast';

// constants
import { DEFAULT_NOTIFICATION_DURATION } from '@provider/constants';

// features
import { closeById, removeById, setShowingById } from '@provider/features/notifications';

// hooks
import { useSelectNotShowingNotifications } from '@provider/selectors';

// types
import type { IAppThunkDispatch, IMainRootState, INotification } from '@provider/types';

export default function useNotifications(): void {
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const toast = useToast({
    containerStyle: {
      margin: '0',
      maxWidth: '100%',
      minWidth: '100%',
      padding: '0.5rem',
      width: '100%',
    },
    duration: DEFAULT_NOTIFICATION_DURATION,
    isClosable: true,
    position: 'top',
  });
  // selectors
  const newNotifications: INotification[] = useSelectNotShowingNotifications();

  useEffect(() => {
    newNotifications.forEach(({ ephemeral, description, id, title, type }) => {
      dispatch(setShowingById(id));
      toast({
        onCloseComplete: () => (ephemeral ? dispatch(removeById(id)) : dispatch(closeById(id))),
        render: ({ onClose }) => (
          <Toast description={description || undefined} title={title} onClose={onClose} type={type} />
        ),
      });
    });
  }, [newNotifications]);
}
