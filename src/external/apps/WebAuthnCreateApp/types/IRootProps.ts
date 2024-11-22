import type { ColorMode } from '@chakra-ui/react';

// types
import type { IClientInformation } from '@common/types';

interface IRootProps {
  clientInfo: IClientInformation;
  colorMode: ColorMode;
  fontFamily: string;
  onCancel: () => void;
}

export default IRootProps;
