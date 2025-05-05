// types
import type { IAccountUpdateRequest } from '@provider/features/accounts';

interface IOptions {
  accountID: string;
  requestID: string;
  updateRequests: IAccountUpdateRequest[];
}

export default IOptions;
