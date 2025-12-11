import { NotificationStatus } from '../enums/notification-status.enum';

export class NotificationEntity {
  constructor(
    private readonly _id: string,
    private readonly _title: string,
    private readonly _message: string,
    private readonly _isRead: boolean,
    private readonly _userId: string,
    private readonly _notifcationStatus: NotificationStatus,
    private readonly _createdAt: Date,
  ) {}

  static create(props: {
    title: string;
    message: string;
    userId: string;
    type: NotificationStatus;
  }): NotificationEntity {
    return new NotificationEntity(
      '',
      props.title,
      props.message,
      false,
      props.userId,
      props.type,
      new Date(),
    );
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get message() {
    return this._message;
  }

  get isRead() {
    return this._isRead;
  }

  get userId() {
    return this._userId;
  }

  get createdAt() {
    return this._createdAt;
  }
  get notificationStatus() {
    return this._notifcationStatus;
  }

  markAsRead(): NotificationEntity {
    return new NotificationEntity(
      this._id,
      this._title,
      this._message,
      true,
      this._userId,
      this._notifcationStatus,
      this._createdAt,
    );
  }
}
