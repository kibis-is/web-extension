interface IBaseMessageEventPayload<Message> {
  message: Message;
  originTabID: number;
}

export default IBaseMessageEventPayload;
