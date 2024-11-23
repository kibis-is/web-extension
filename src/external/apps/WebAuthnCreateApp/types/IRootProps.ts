import type { ColorMode } from '@chakra-ui/react';

// types
import type { IClientInformation } from '@common/types';
import type { IExternalAccount } from '@external/types';

interface IRootProps {
  accounts: IExternalAccount[];
  clientInfo: IClientInformation;
  colorMode: ColorMode;
  fetching: boolean;
  fontFamily: string;
  onCancelClick: () => void;
  onRegisterClick: () => void;
  onSelect: (account: IExternalAccount) => void;
  saving: boolean;
}

export default IRootProps;
