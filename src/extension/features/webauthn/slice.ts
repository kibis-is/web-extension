import { createSlice } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import { sendWebAuthnRegisterResponseThunk } from './thunks';

// utils
import getInitialState from './utils/getInitialState';

const slice = createSlice({
  extraReducers: (builder) => {
    /** send webauthn register response **/
    builder.addCase(sendWebAuthnRegisterResponseThunk.fulfilled, (state) => {
      state.saving = false;
    });
    builder.addCase(sendWebAuthnRegisterResponseThunk.pending, (state) => {
      state.saving = true;
    });
    builder.addCase(sendWebAuthnRegisterResponseThunk.rejected, (state) => {
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
