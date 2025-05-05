// errors
import { BaseExtensionError } from '@common/errors';

// types
import type { IBaseAsyncThunkConfig, IMainRootState } from '@provider/types';

interface IQueryByIdAsyncThunkConfig extends IBaseAsyncThunkConfig<IMainRootState> {
  rejectValue?: BaseExtensionError;
}

export default IQueryByIdAsyncThunkConfig;
