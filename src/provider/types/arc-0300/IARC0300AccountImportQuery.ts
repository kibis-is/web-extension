// enums
import { ARC0300QueryEnum } from '@provider/enums';

// types
import type { IARC0300PaginationQueryItem } from '@provider/types';

interface IARC0300AccountImportQuery {
  [ARC0300QueryEnum.Checksum]?: string;
  [ARC0300QueryEnum.Name]?: string[];
  [ARC0300QueryEnum.Page]?: IARC0300PaginationQueryItem;
  [ARC0300QueryEnum.PrivateKey]: string[];
}

export default IARC0300AccountImportQuery;
