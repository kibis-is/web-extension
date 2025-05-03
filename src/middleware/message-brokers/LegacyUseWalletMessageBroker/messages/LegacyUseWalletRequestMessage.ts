// enums
import { LegacyUseWalletMessageReferenceEnum } from "@common/enums";

// types
import type { ILegacyUseWalletRequestMessage } from "../types";

export default class LegacyUseWalletRequestMessage<Params>
  implements ILegacyUseWalletRequestMessage<Params>
{
  public readonly id: string;
  public readonly params: Params | null;
  public readonly reference: LegacyUseWalletMessageReferenceEnum;

  constructor({
    id,
    params,
    reference,
  }: ILegacyUseWalletRequestMessage<Params>) {
    this.id = id;
    this.params = params;
    this.reference = reference;
  }
}
