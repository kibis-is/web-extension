import type { ColorMode, ResponsiveValue } from '@chakra-ui/react';
import type { Property } from 'csstype';

// errors
import { BaseExtensionError } from '@common/errors';

// types
import type { IClientInformation } from '@common/types';
import type { IResult } from '@client/managers/WebAuthnMessageManager';

interface IBaseRootProps {
  clientInfo: IClientInformation;
  colorMode: ColorMode;
  error: BaseExtensionError | null;
  fontFamily?: ResponsiveValue<Property.FontFamily>;
  onCancelClick: () => void;
  onTryAgainClick: () => void;
  result: IResult | null;
}

export default IBaseRootProps;
