import type { IconType } from 'react-icons';

interface IProps {
  icon: IconType;
  isSelected?: boolean;
  label: string;
  onClick?: () => void;
}

export default IProps;
