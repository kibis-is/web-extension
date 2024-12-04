import type { ColorMode, ResponsiveValue } from '@chakra-ui/react';
import type { Property } from 'csstype';

// errors
import { BaseExtensionError } from '@common/errors';

// types
import type { IClientInformation } from '@common/types';
import type { IRegisterResult } from '@external/managers/WebAuthnMessageManager';

interface IRootProps {
  clientInfo: IClientInformation;
  colorMode: ColorMode;
  error: BaseExtensionError | null;
  fontFamily?: ResponsiveValue<Property.FontFamily>;
  onCancelClick: () => void;
  onRegisterClick: () => void;
  onTryAgainClick: () => void;
  result: IRegisterResult | null;
}

export default IRootProps;
