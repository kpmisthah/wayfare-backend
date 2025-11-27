export class MessageEntity {
  constructor(
    private readonly _id: string,
    private readonly _senderId: string,
    private readonly _content: string,
    private readonly _conversationId: string | null, // null for group messages
    private readonly _groupId: string | null, // null for 1-on-1 messages
    private readonly _createdAt?: string,
  ) {}
  static create(props: {
    conversationId: string;
    senderId: string;
    content: string;
    createdAt?: string;
  }) {
    return new MessageEntity(
      '',
      props.senderId,
      props.content,
      props.conversationId,
      null,
      props.createdAt,
    );
  }

  static createGroupMessage(props: {
    groupId: string;
    senderId: string;
    content: string;
    createdAt?: string;
  }): MessageEntity {
    return new MessageEntity(
      '',
      props.senderId,
      props.content,
      null, // conversationId = null
      props.groupId,
      props.createdAt,
    );
  }

  //getters
  get id() {
    return this._id;
  }
  get conversationId() {
    return this._conversationId;
  }
  get senderId() {
    return this._senderId;
  }
  get content() {
    return this._content;
  }
  get createdAt() {
    return this._createdAt;
  }
  get groupId(){
    return this._groupId
  }
  get isGroupMessage(): boolean {
    return this._groupId !== null;
  }
}
