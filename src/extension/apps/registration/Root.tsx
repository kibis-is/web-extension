import { Center, Flex } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

// constants
import { BODY_BACKGROUND_COLOR } from '@common/constants';

// features
import { fetchARC0200AssetsFromStorageThunk } from '@extension/features/arc0200-assets';
import { fetchFromStorageThunk as fetchSettingsFromStorageThunk } from '@extension/features/settings';
import {
  fetchFromStorageThunk as fetchSystemInfoFromStorageThunk,
  setI18nAction,
} from '@extension/features/system';

// types
import type {
  IAppThunkDispatch,
  IRegistrationRootState,
  IRootProps,
} from '@extension/types';

const Root: FC<IRootProps> = ({ i18n }) => {
  const dispatch: IAppThunkDispatch<IRegistrationRootState> =
    useDispatch<IAppThunkDispatch<IRegistrationRootState>>();

  useEffect(() => {
    dispatch(setI18nAction(i18n));
    dispatch(fetchSystemInfoFromStorageThunk());
    dispatch(fetchARC0200AssetsFromStorageThunk());
    dispatch(fetchSettingsFromStorageThunk());
  }, []);

  return (
    <Center as="main" backgroundColor={BODY_BACKGROUND_COLOR}>
      <Flex
        alignItems="center"
        direction="column"
        justifyContent="center"
        minH="100vh"
        w="full"
      >
        <Outlet />
      </Flex>
    </Center>
  );
};

export default Root;
