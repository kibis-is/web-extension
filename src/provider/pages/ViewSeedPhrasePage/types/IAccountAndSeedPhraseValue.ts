// types
import type { IAccountWithExtendedProps } from '@provider/types';

interface IAccountAndSeedPhraseValue {
  account: IAccountWithExtendedProps;
  masked: boolean;
  seedPhrase: string;
}

export default IAccountAndSeedPhraseValue;
