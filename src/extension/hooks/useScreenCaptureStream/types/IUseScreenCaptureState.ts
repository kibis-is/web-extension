// errors
import { BaseExtensionError } from '@common/errors';

interface IUseScreenCaptureState {
  error: BaseExtensionError | null;
  loading: boolean;
  reset: () => void;
  startStream: () => Promise<void>;
  stopStream: () => void;
  stream: MediaStream | null;
}

export default IUseScreenCaptureState;
