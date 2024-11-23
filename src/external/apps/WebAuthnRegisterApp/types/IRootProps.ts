import type { ColorMode } from '@chakra-ui/react';

// types
import type { IClientInformation, IExternalAccount } from '@common/types';

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
  selectedAccount: IExternalAccount | null;
}

export default IRootProps;
