import { BaseARC0027Error } from "@agoralabs-sh/avm-web-provider";

// enums
import { LegacyUseWalletMessageReferenceEnum } from "@common/enums";

interface ILegacyUseWalletResponseMessage<Result> {
  error: BaseARC0027Error | null;
  id: string;
  reference: LegacyUseWalletMessageReferenceEnum;
  result: Result | null;
  requestId: string;
}

export default ILegacyUseWalletResponseMessage;
