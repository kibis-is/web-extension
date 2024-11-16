import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// types
import type { IState } from './types';

// utils
import getInitialState from './utils/getInitialState';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.MoveGroupModal,
  reducers: {
    closeModal: (state: Draft<IState>) => {
      state.accountID = null;
    },
    openModal: (state: Draft<IState>, action: PayloadAction<string | null>) => {
      state.accountID = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { closeModal, openModal } = slice.actions;
