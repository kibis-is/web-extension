// enums
import { ScanModeEnum } from '@provider/enums';

type IStartScanningOptions =
  | {
      mode: ScanModeEnum.Camera | ScanModeEnum.ScreenCapture;
      videoElement: HTMLVideoElement;
    }
  | {
      mode: ScanModeEnum.Tab;
    };

export default IStartScanningOptions;
