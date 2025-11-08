import { UpdateUserProfileDto } from 'src/application/dtos/update-user-profile.dto';

export class UserProfileEntity {
  constructor(
    private readonly _id: string,
    private readonly _location: string,
    private readonly _phone: string,
    private readonly _userId: string,
  ) {}
  static createProfile(
    props: {
      location?: string;
      phone?: string;
    },
    id,
  ) {
    return new UserProfileEntity(
      '',
      props.location ?? '',
      props.phone ?? '',
      id,
    );
  }

  public updateUserProfile(props: { phone?: string; location?: string }) {
    return new UserProfileEntity(
      this._id,
      props.location ?? this._location,
      props.phone ?? this._phone,
      this._userId,
    );
  }
  //getters
  get id(): string {
    return this._id;
  }
  get location(): string {
    return this._location;
  }
  get phone(): string {
    return this._phone;
  }
  get userId(): string {
    return this._userId;
  }
}
