import { ElementType } from 'react';

interface IProps {
  description: string;
  icon: ElementType;
  isDisabled?: boolean;
  onClick: () => void;
  title: string;
  tooltipText?: string;
}

export default IProps;
