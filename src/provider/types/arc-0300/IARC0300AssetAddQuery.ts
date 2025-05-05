// enums
import { ARC0300AssetTypeEnum, ARC0300QueryEnum } from '@provider/enums';

interface IARC0300AssetAddQuery {
  [ARC0300QueryEnum.GenesisHash]: string;
  [ARC0300QueryEnum.Type]: ARC0300AssetTypeEnum;
}

export default IARC0300AssetAddQuery;
