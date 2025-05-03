import { setFailed } from '@actions/core';

// enums
import { ErrorCodeEnum } from '../enums';

// errors
import { ActionError } from '../errors';

export default function handleError(error: Error | ActionError): void {
  if ((error as ActionError).code && (error as ActionError).code > 0) {
    setFailed(error.message);

    process.exit((error as ActionError).code);
  }

  setFailed(error.message);

  process.exit(ErrorCodeEnum.UnknownError);
}
