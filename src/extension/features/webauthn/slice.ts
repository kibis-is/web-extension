import { createSlice } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  sendWebAuthnAuthenticateResponseThunk,
  sendWebAuthnRegisterResponseThunk,
} from './thunks';

// utils
import getInitialState from './utils/getInitialState';

const slice = createSlice({
  extraReducers: (builder) => {
    /** send webauthn authenticate response **/
    builder.addCase(
      sendWebAuthnAuthenticateResponseThunk.fulfilled,
      (state) => {
        state.saving = false;
      }
    );
    builder.addCase(sendWebAuthnAuthenticateResponseThunk.pending, (state) => {
      state.saving = true;
    });
    builder.addCase(sendWebAuthnAuthenticateResponseThunk.rejected, (state) => {
      state.saving = false;
    });
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
