export class ConversationEntity {
  constructor(
    private readonly _id: string,
    private readonly _participantIds: string[],
    private readonly _createdAt?: Date,
  ) {}
  static create(props: { participantIds: string[]; createdAt: Date }) {
    return new ConversationEntity('', props.participantIds, props.createdAt);
  }

  //getters

  get id() {
    return this._id;
  }

  get participantIds() {
    return this._participantIds;
  }

  get createdAt() {
    return this._createdAt;
  }
}
