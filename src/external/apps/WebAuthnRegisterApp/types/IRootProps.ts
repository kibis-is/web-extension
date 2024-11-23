import type { ColorMode, ResponsiveValue } from '@chakra-ui/react';
import type { Property } from 'csstype';

// types
import type { IClientInformation, IExternalAccount } from '@common/types';

interface IRootProps {
  accounts: IExternalAccount[];
  clientInfo: IClientInformation;
  colorMode: ColorMode;
  fetching: boolean;
  fontFamily?: ResponsiveValue<Property.FontFamily>;
  onCancelClick: () => void;
  onRegisterClick: () => void;
  onSelect: (account: IExternalAccount) => void;
  saving: boolean;
  selectedAccount: IExternalAccount | null;
}

export default IRootProps;
