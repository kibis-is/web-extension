interface IProps {
  characterLimit?: number;
  color?: string;
  fontSize?: string;
  isEditing?: boolean;
  isLoading?: boolean;
  onCancel: () => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  value: string;
}

export default IProps;
