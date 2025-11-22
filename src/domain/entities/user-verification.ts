import { Role } from '../enums/role.enum';

export class UserVerificationEntity {
  constructor(
    private readonly _id: string,
    private readonly _name: string | null,
    private readonly _email: string,
    private readonly _otp: string,
    private readonly _otp_expiry: Date,
    private readonly _password: string,
    private readonly _role: Role,
    private readonly _phone?: string,
  ) {}

  static create(props: {
    name: string;
    email: string;
    otp: string;
    otp_expiry: Date;
    password: string;
    role: Role;
    phone?: string;
  }): UserVerificationEntity {
    if (!props.name) {
      throw new Error('name is required');
    }
    if (!props.email) {
      throw new Error('email is required');
    }
    if (!props.otp) {
      throw new Error('No Otp');
    }
    if (props.otp_expiry > new Date(Date.now() + 5 * 60 * 1000)) {
      throw new Error('Otp is Expired');
    }
    if (!props.password) {
      throw new Error('Password is required');
    }
    return new UserVerificationEntity(
      '',
      props.name,
      props.email,
      props.otp,
      props.otp_expiry,
      props.password,
      props.role,
      props.phone,
    );
  }
  public updateUserOtp(props: { otp; otp_expiry }) {
    return new UserVerificationEntity(
      this._id,
      this._name,
      this._email,
      props.otp,
      props.otp_expiry,
      this._password,
      this._role,
      this._phone,
    );
  }

  //getters
  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name ?? '';
  }
  get email(): string {
    return this._email;
  }
  get otp(): string {
    return this._otp;
  }
  get otp_expiry(): Date {
    return this._otp_expiry;
  }
  get password(): string {
    return this._password;
  }
  get role(): Role {
    return this._role;
  }
  get phone(): string {
    return this._phone ?? '';
  }
}
