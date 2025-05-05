import type { ISignTransactionsParams } from '@agoralabs-sh/avm-web-provider';

// features
import type { IBaseResponseThunkPayload } from '@provider/features/messages';

interface ISignTransactionsResponseThunkPayload extends IBaseResponseThunkPayload<ISignTransactionsParams> {
  stxns: (string | null)[] | null;
}

export default ISignTransactionsResponseThunkPayload;
