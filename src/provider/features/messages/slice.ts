import { createSlice, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@provider/enums';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.Messages,
  reducers: {
    noop: () => {
      return;
    },
  },
});

export const reducer: Reducer = slice.reducer;
