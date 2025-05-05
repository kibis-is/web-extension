// enums
import { ARC0300QueryEnum } from '@provider/enums';

interface IARC0300AccountImportWithAddressQuery {
  [ARC0300QueryEnum.Address]: string;
  [ARC0300QueryEnum.Asset]: string[];
}

export default IARC0300AccountImportWithAddressQuery;
