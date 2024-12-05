interface IBaseMessage<Reference = string> {
  id: string;
  reference: Reference;
}

export default IBaseMessage;
