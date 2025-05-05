import type { IEnableParams } from '@agoralabs-sh/avm-web-provider';

// features
import type { IBaseResponseThunkPayload } from '@provider/features/messages';

// types
import type { ISession } from '@provider/types';

interface IEnableResponseThunkPayload extends IBaseResponseThunkPayload<IEnableParams> {
  session: ISession | null;
}

export default IEnableResponseThunkPayload;
