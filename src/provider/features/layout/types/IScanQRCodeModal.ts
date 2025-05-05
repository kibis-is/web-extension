// enums
import { ARC0300AuthorityEnum, ARC0300PathEnum } from '@provider/enums';

interface IScanQRCodeModal {
  allowedAuthorities: ARC0300AuthorityEnum[];
  allowedParams: ARC0300PathEnum[];
}

export default IScanQRCodeModal;
