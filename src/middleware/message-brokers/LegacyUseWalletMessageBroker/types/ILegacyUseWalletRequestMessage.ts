// enums
import { LegacyUseWalletMessageReferenceEnum } from "@common/enums";

interface ILegacyUseWalletRequestMessage<Params> {
  id: string;
  params: Params | null;
  reference: LegacyUseWalletMessageReferenceEnum;
}

export default ILegacyUseWalletRequestMessage;
