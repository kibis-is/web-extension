// types
import { AppTypeEnum } from '@provider/enums';

interface ICreateWindowOptions {
  left?: number;
  searchParams?: URLSearchParams;
  top?: number;
  type: AppTypeEnum;
}

export default ICreateWindowOptions;
