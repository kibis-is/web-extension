import type { MouseEvent } from 'react';

// types
import type { IBaseComponentProps } from '@common/types';

interface IProps extends IBaseComponentProps {
  buttonLabel: string;
  description?: string;
  isWarning?: boolean;
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default IProps;
