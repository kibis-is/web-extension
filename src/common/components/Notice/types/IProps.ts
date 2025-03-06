import type { StackProps } from '@chakra-ui/react';

interface IProps extends StackProps {
  message: string;
  size?: 'lg' | 'md' | 'sm' | 'xs';
  type?: 'error' | 'info' | 'warning';
}

export default IProps;
