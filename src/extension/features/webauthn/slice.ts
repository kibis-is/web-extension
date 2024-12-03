import { createSlice } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import { sendWebAuthnCreateResponseThunk } from './thunks';

// utils
import getInitialState from './utils/getInitialState';

const slice = createSlice({
  extraReducers: (builder) => {
    /** send webauthn create response **/
    builder.addCase(sendWebAuthnCreateResponseThunk.fulfilled, (state) => {
      state.saving = false;
    });
    builder.addCase(sendWebAuthnCreateResponseThunk.pending, (state) => {
      state.saving = true;
    });
    builder.addCase(sendWebAuthnCreateResponseThunk.rejected, (state) => {
      state.saving = false;
    });
  },
  initialState: getInitialState(),
  name: StoreNameEnum.WebAuthn,
  reducers: {
    noop: () => {
      return;
    },
  },
});

export const reducer = slice.reducer;
