import type { ResponsiveValue } from '@chakra-ui/react';
import * as CSS from 'csstype';

// types
import type { IBaseComponentProps } from '@common/types';
import type IEncryptionState from './IEncryptionState';

interface IProps extends IBaseComponentProps {
  encryptionProgressState: IEncryptionState[];
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
}

export default IProps;
