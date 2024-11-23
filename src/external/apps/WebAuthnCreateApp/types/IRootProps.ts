import type { ColorMode } from '@chakra-ui/react';

// types
import type { IClientInformation } from '@common/types';

interface IRootProps {
  clientInfo: IClientInformation;
  colorMode: ColorMode;
  fetching: boolean;
  fontFamily: string;
  onCancelClick: () => void;
  onRegisterClick: () => void;
  onSelect: () => void;
  saving: boolean;
}

export default IRootProps;
