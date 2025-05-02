import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { generate as generateUUID } from '@agoralabs-sh/uuid';

// enums
import { StoreNameEnum } from '@extension/enums';

// types
import type { IAddNotificationPayload, IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.Notifications,
  reducers: {
    closeById: (state: Draft<IState>, action: PayloadAction<string>) => {
      state.items = state.items.map((value) =>
        value.id === action.payload
          ? { ...value, showing: false, shown: true }
          : value
      );
    },
    create: (
      state: Draft<IState>,
      action: PayloadAction<IAddNotificationPayload>
    ) => {
      state.items = [
        ...state.items,
        {
          description: action.payload.description || null,
          ephemeral: action.payload.ephemeral || false,
          id: generateUUID(),
          title: action.payload.title,
          read: false,
          showing: false,
          shown: false,
          type: action.payload.type,
        },
      ];

      // for achievements, show confetti
      if (action.payload.type === 'achievement') {
        state.showingConfetti = true;
      }
    },
    removeAll: (state: Draft<IState>) => {
      state.items = [];
    },
    removeById: (state: Draft<IState>, action: PayloadAction<string>) => {
      state.items = state.items.filter((value) => value.id !== action.payload);
    },
    setShowingById: (state: Draft<IState>, action: PayloadAction<string>) => {
      state.items = state.items.map((value) =>
        value.id === action.payload ? { ...value, showing: true } : value
      );
    },
    setShowingConfetti: (
      state: Draft<IState>,
      action: PayloadAction<boolean>
    ) => {
      state.showingConfetti = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const {
  closeById,
  create,
  removeAll,
  removeById,
  setShowingById,
  setShowingConfetti,
} = slice.actions;
