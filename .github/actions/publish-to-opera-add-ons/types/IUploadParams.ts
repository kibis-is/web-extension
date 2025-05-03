// types
import ILogger from './ILogger';

interface IUploadParams {
  email: string;
  extensionID: string;
  logger: ILogger;
  password: string;
  zipPath: string;
}

export default IUploadParams;
