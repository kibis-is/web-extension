import type { ChangeEvent, KeyboardEvent, MutableRefObject } from 'react';

// types
import type { IBaseComponentProps } from '@common/types';

interface IProps extends IBaseComponentProps {
  disabled?: boolean;
  error: string | null;
  hint?: string;
  id?: string;
  inputRef?: MutableRefObject<HTMLInputElement | null>;
  label?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
  required?: boolean;
  value: string;
}

export default IProps;
