import type { ColorMode } from '@chakra-ui/react';
import * as CSS from 'csstype';

interface IExternalTheme {
  colorMode: ColorMode;
  font: CSS.Property.FontFamily;
}

export default IExternalTheme;
