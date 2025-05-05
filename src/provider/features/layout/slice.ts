import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@provider/enums';

// types
import type { IConfirmModal, IScanQRCodeModal, IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.Layout,
  reducers: {
    openConfirmModal: (state: Draft<IState>, action: PayloadAction<IConfirmModal | null>) => {
      state.confirmModal = action.payload;
    },
    setScanQRCodeModal: (state: Draft<IState>, action: PayloadAction<IScanQRCodeModal | null>) => {
      state.scanQRCodeModal = action.payload;
    },
    setSideBar: (state: Draft<IState>, action: PayloadAction<boolean>) => {
      state.sidebar = action.payload;
    },
    setWhatsNewModal: (state: Draft<IState>, action: PayloadAction<boolean>) => {
      state.whatsNewModal = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { openConfirmModal, setScanQRCodeModal, setSideBar, setWhatsNewModal } = slice.actions;
