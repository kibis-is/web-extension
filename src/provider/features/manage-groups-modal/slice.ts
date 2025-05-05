import { createSlice, Draft, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@provider/enums';

// types
import type { IState } from './types';

// utils
import getInitialState from './utils/getInitialState';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.ManageGroupsModal,
  reducers: {
    closeModal: (state: Draft<IState>) => {
      state.isOpen = false;
    },
    openModal: (state: Draft<IState>) => {
      state.isOpen = true;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { closeModal, openModal } = slice.actions;
